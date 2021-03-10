var Game = new Vue({
	el: document.querySelector("main"),
	data,

	methods: {
		// 判断用户名的长度是否合法
		startBtnClick() {
			if (this.username.length <= 2) return alert("用户名不可少于3位字符哦！");
			this.init();
		},
		//新游戏  刷新页面
		myrefresh() {
			window.location.reload();
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
			// 背景移动关闭
			// this.positionY += 5;
			if (this.hit_check(this.p)) this.boom++;
		},
		// 玩家飞机移动
		touchmove() {
			let touch, x, y;
			// 游戏开始就继续向下运行，游戏结束就跳出飞机不移动
			if (!this.start) return;
			// 
			if (event.touches) touch = event.touches[0];
			else touch = event;
			// 获取玩家相对于游戏区域的坐标值 X/Y 轴
			/* touch.clinetX 获取当前落点相对于 左边 边界的值。 */
			/* touch.clinetY 获取当前落点相对于 上边 边界的值。 */
			x = touch.clientX - this.$refs.plane.offsetLeft - this.p.w / 2;
			y = touch.clientY - this.$refs.plane.offsetTop - this.p.h / 2;
			// 判断玩家的飞机是否超出游戏范围，超出就取边界值。不是去其本身
			y = y < 0 ? 0 : y > (this.$refs.plane.offsetHeight - this.p.h) ? this.$refs.plane.offsetHeight - this.p.h : y;
			x = x < 0 ? 0 : x > (this.$refs.plane.offsetWidth - this.p.w) ? this.$refs.plane.offsetWidth - this.p.w : x;
			// 玩家飞机绑定鼠标坐标。
			this.p.x = x;
			this.p.y = y;
		},
		// 创建敌军
		createE() {
			// 保存this
			let _this = this,
				x;
			// 启动创建敌军的定时器
			this.timers.push(setInterval(function () {
				// 创建敌军的  横向位置  随机
				x = Math.ceil(Math.random() * (_this.$refs.plane.offsetWidth - 80));
				// 调用公共创建  创建敌军对象 传入 对象本身 e 和  对象的数据对象 {x:位置,y:位置}
				_this.build('e', {
					x: x,   // x 轴的位置
					y: 5		// y 轴的位置
				})
			}, 200));  // 没 200毫秒创建一次 敌军
			// 添加 敌军移动的  循环定时器
			this.timers.push(setInterval(function () {
				// 定时器中 调用移动函数 把敌军对象本身传递进去
				_this.move('e')
			}, 20)); //每20毫秒 就 让敌军 执行一次移动
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
			// 游戏开始才能创建子弹
			if (!this.start) return;
			// 创建子弹对象的 数据对象
			let bullter = {
				// 坐标值
				x: (e.x + (e.w ? e.w : 30) / 2),
				y: e.y - (e.h ? e.h : -30),
				// 速度  判断敌方和玩家的子弹方向
				speed: table == "p" ? -6 : 10,
				// 添加 属性 tag : p/e 用来判断是玩家还是敌人的子弹
				tag: table
			};
			// 创建子弹对象 进子弹队对象中 的 数组
			this.build('bullets', bullter);
		},

		// 公共创建
		build(table, data) {
			let _this = this;
			// 把创建对象的 数据对象 添加进 数组 arr 中	
			this[table].arr.push(data);
		},

		// 公共移动
		move(table) {
			// 遍历 参数对象 中的  arr 数组  有多少个对象全部添加移动函数
			for (let i = 0; i < this[table].arr.length; i++) {
				let e   = this[table].arr[i],
					math  = Math.random() * 100,
					speed = this[table].speed ? this[table].speed : 5;

				// 如果是子弹移动---------传递的参数是子弹
				if (table == 'bullets') speed = e.speed;         // speed= 6 
				e.y += speed;     //  敌军每一次移动的距离为  5
				// 如果不是子弹dom的移动
				if (table !== 'bullets') {
					// 如果其 y轴的位置 超出  游戏范围  就删除
					if (e.y > this.$refs.plane.offsetHeight - 55) this[table].arr.splice(i, 1);
					// 是敌军 且 随机数 math 的值小于 1 发射子弹  (百分之一的概率发射子弹)
					if (table == 'e' && math < 1) {
						// 发射子弹
						this.createButter('e', e);
					}
				}
				// 是子弹的dom的时候
			  else {
					// 是玩家子弹
					if (e.tag == 'p') {
						// 子弹是否碰撞到敌军 碰到则删除子弹 dom
						if (this.hit_check(e)) this[table].arr.splice(i, 1);
						// 子弹是否超出边界  超出则删除子弹 dom
						else if (e.y < 0) this[table].arr.splice(i, 1);
					} 
					// 是敌军子弹
					else {
						// 子弹和玩家碰撞的时候
						if (this.hit(e, this.p)) {
							// 删除这个子弹的DOM
							this[table].arr.splice(i, 1);
							// 玩家被击中的数量 累加
							this.HitTimes++;
						} 
						// 子弹超出游戏范围 删除子弹 DOM
						else if (e.y > this.$refs.plane.offsetHeight - 30) this[table].arr.splice(i, 1);
					}
				}
			}
		},

		// 是否击毁敌军
		hit_check(b) { 
			// 遍历 所有敌机的 数组 获取 坐标值 进行依次判断
			for (let i = 0; i < this.e.arr.length; i++) {
				// 判断是否击中 敌机
				if (this.hit(b, this.e.arr[i])) {
					// 删除被击中的敌机 dom
					this.e.arr.splice(i, 1);
					// 机会数量累加
					this.hitCount++;
					// 返回   击中 
					return true;
				}
			}
		},

		// 碰撞
		hit(b, e) { 
			// 计算子弹和每个敌机的直线距离
			let d = this.judgeHit(b.x, b.y, e.x, e.y);
			// 判断距离是否小于临界值
			if (d < 35) return true;
		},

		// 计算两个点的距离差
		judgeHit(x1, y1, x2, y2) {
			let a = x1 - x2,
				b = y1 - y2,
				// (x1 - x2)^2 + (y1 -y2)^2  两点之间的直线距离
				result = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
			// 四舍五入 去整数
			return Math.round(result);
		},
		// 暂停	
		pause() { 
			// 停止游戏
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
	// 监听玩家输入事件
	watch: {
		username() { 
			if (this.username.length > 2) this.face = "shy";
			else this.face = "ordinary";
		}
	},

	// 监听全局键盘事件
	mounted() {
		// 保存this
		let _this = this;
		document.onkeyup = function (e) {
			// space发射子弹
			(e.keyCode == 32) && _this.createButter("p", _this.p);
			// p结束游戏
			(e.keyCode == 80) && _this.pause()
		}
	},
	// 计算属性
	computed: {
		faceChange() {
			return "image/" + this.face + ".png";
		},
		achievement() {
			return window.data.hitCount * 10 - window.data.boom * 30 - window.data.HitTimes * 5
		}
	}
});