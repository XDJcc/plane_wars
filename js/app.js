var Game = new Vue({
	el: document.querySelector("main"),
	data,

	methods: {
		// 判断用户名的长度是否合法
		startBtnClick() {
			if (this.username.length <= 2) return alert("用户名不可少于3位字符哦！");
			this.init();
		},
		//新游戏
		myrefresh() {
			window.location.reload();
		},
		// 继续游戏
		/* pause() { // 暂停
			this.start = false;
			// 结算界面不显示
			this.$refs.end.style.display = "block";
			// 数据界面不显示
			this.$refs.hit.style.display = "none";
			})
		} */
		refresh(){
			// 结算界面不显示
			this.$refs.end.style.display = "none";
			// 显示实时数据。
			this.$refs.hit.style.display = "block";
			this.init();
		},
		//  初始化页面
		init() {
			let _this = this;
			// 开始游戏
			this.start = true;
			// 姓名输入界面关闭
			this.$refs.alert.style.display = "none";

			// 创建敌军
			this.createE();
			// 创建玩家
			this.createPlane();
			// 添加北京移动的循环定时器
			// this.timers.push(setInterval(this.bgMove, 20))
			// 添加是否装上敌军的循环定时器
			this.timers.push(setInterval(this.bgMove, 20))
			// 
			this.timers.push(setInterval(function () {
				_this.move('bullets')
			}, 20))
		},
		// 背景移动 顺带判断玩家是否装上敌军
		bgMove() {
			// this.positionY += 5;
			if (this.hit_check(this.p)) this.boom++;
		},
		// 飞机移动
		touchmove() {
			let touch, x, y;
			if (!this.start) return;

			if (event.touches) touch = event.touches[0];
			else touch = event;

			x = touch.clientX - this.$refs.plane.offsetLeft - this.p.w / 2;
			y = touch.clientY - this.$refs.plane.offsetTop - this.p.h / 2;

			y = y < 0 ? 0 : y > (this.$refs.plane.offsetHeight - this.p.h) ? this.$refs.plane.offsetHeight - this.p.h : y;
			x = x < 0 ? 0 : x > (this.$refs.plane.offsetWidth - this.p.w) ? this.$refs.plane.offsetWidth - this.p.w : x;

			this.p.x = x;
			this.p.y = y;
		},
		// 创建敌军
		createE() {
			let _this = this,
				x;

			this.timers.push(setInterval(function () {
				x = Math.ceil(Math.random() * (_this.$refs.plane.offsetWidth - 80));
				_this.build('e', {
					x: x,
					y: 5
				})
			}, 200));

			this.timers.push(setInterval(function () {
				_this.move('e')
			}, 20));
		},
		// 创建行星
		createPlane() {
			let _this = this,
				x;

			this.timers.push(setInterval(function () {
				x = Math.ceil(Math.random() * (_this.$refs.plane.offsetWidth - 80));
				_this.build('plane', {
					x: x,
					y: 5
				})
			}, 2000));

			this.timers.push(setInterval(function () {
				_this.move('plane')
			}, 20));
		},
		// 创建子弹
		createButter(table, e) {
			if (!this.start) return;

			let bullter = {
				x: (e.x + (e.w ? e.w : 30) / 2),
				y: e.y - (e.h ? e.h : -30),
				speed: table == "p" ? -6 : 10,
				tag: table
			};

			this.build('bullets', bullter);
		},
		// 公共创建
		build(table, data) {
			let _this = this;
			this[table].arr.push(data);
		},
		// 公共移动
		move(table) {
			for (let i = 0; i < this[table].arr.length; i++) {
				let e = this[table].arr[i],
					math = Math.random() * 100,
					speed = this[table].speed ? this[table].speed : 5;

				if (table == 'bullets') speed = e.speed;

				e.y += speed;

				if (table !== 'bullets') { // 如果不是子弹dom的移动
					if (e.y > this.$refs.plane.offsetHeight - 55) this[table].arr.splice(i, 1);

					if (table == 'e' && math < 1) {
						this.createButter('e', e);
					}
				} else {
					if (e.tag == 'p') {
						if (this.hit_check(e)) this[table].arr.splice(i, 1);
						else if (e.y < 0) this[table].arr.splice(i, 1);
					} else {
						if (this.hit(e, this.p)) {
							this[table].arr.splice(i, 1);
							this.HitTimes++;
						} else if (e.y > this.$refs.plane.offsetHeight - 30) this[table].arr.splice(i, 1);
					}
				}
			}
		},

		hit_check(b) { // 是否击毁敌军
			for (let i = 0; i < this.e.arr.length; i++) {
				if (this.hit(b, this.e.arr[i])) {
					this.e.arr.splice(i, 1);
					this.hitCount++;
					return true;
				}
			}
		},

		hit(b, e) { // 碰撞
			let d = this.judgeHit(b.x, b.y, e.x, e.y);
			if (d < 35) return true;
		},
		// 计算两个点的距离差
		judgeHit(x1, y1, x2, y2) {
			let a = x1 - x2,
				b = y1 - y2,
				result = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
			return Math.round(result);
		},

		pause() { // 暂停
			this.start = false;
			// 结算界面不显示
			this.$refs.end.style.display = "block";
			// 数据界面不显示
			this.$refs.hit.style.display = "none";
			// 停止所有的运行定时器
			this.timers.forEach(element => {
				clearInterval(element);
			})
		}
	},

	watch: {
		username() { // 监听玩家输入事件
			if (this.username.length > 2) this.face = "shy";
			else this.face = "ordinary";
		}
	},

	mounted() {
		// 保存this
		let _this = this;
		document.onkeyup = function (e) {
			// space发射子弹
			(e.keyCode == 32) && _this.createButter("p", _this.p);
			// p结束游戏
			(e.keyCode == 80) && _this.pause();
		}
	},
	// 创建函数返回表情改变的图片地址
	computed: {
		faceChange() {
			return "image/" + this.face + ".png";
		},
		achievement() {
			return window.data.hitCount * 10 - window.data.boom * 30 - window.data.HitTimes * 5
		}
	}
});