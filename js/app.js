var Game = new Vue({
	el : document.querySelector("main"),
	data,

	methods:{
		startBtnClick() {
			if ( this.username.length <= 2 ) return alert("用户名不可少于3位字符哦！");
			this.init();
		},

		init() {// 初始化
			let _this = this;
			this.start = true;
			this.$refs.alert.style.display = "none";

			this.createE();
			this.createPlane();
			this.timers.push( setInterval( this.bgMove,20 ) )
			this.timers.push( setInterval(function() { _this.move('bullets') }, 20 ) )
		},

		bgMove () { // 背景移动 顺带判断玩家是否装上敌军
			this.positionY += 5;
			if ( this.hit_check(this.p) ) this.boom++;
		},

		touchmove(){// 飞机移动
			let touch,x,y;
			if ( !this.start ) return;

			if(event.touches) touch = event.touches[0];
			else touch = event;

			x = touch.clientX - this.$refs.plane.offsetLeft - this.p.w / 2;
			y = touch.clientY - this.$refs.plane.offsetTop - this.p.h / 2;

			y = y < 0 ? 0 : y > (this.$refs.plane.offsetHeight - this.p.h) ? this.$refs.plane.offsetHeight - this.p.h : y;
			x = x < 0 ? 0 : x > (this.$refs.plane.offsetWidth - this.p.w) ? this.$refs.plane.offsetWidth - this.p.w : x;

			this.p.x = x;
			this.p.y = y;
		},

		createE() { // 创建敌军
			let _this = this,x;

			this.timers.push( setInterval( function() {
				x = Math.ceil( Math.random() * ( _this.$refs.plane.offsetWidth - 80 ) );
				_this.build('e',{ x: x, y: 5 })
			}, 200 ));

			this.timers.push( setInterval( function() { _this.move('e') }, 20 ));
		},

		createPlane() {// 创建行星
			let _this = this,x;

			this.timers.push( setInterval( function() {
				x = Math.ceil( Math.random() * ( _this.$refs.plane.offsetWidth - 80 ) );
				_this.build('plane',{ x: x, y: 5 })
			}, 2000 ));

			this.timers.push( setInterval( function() { _this.move('plane') }, 20 ));
		},

		createButter(table,e) {// 创建子弹
			if ( !this.start ) return;

			let bullter = {
				x:(e.x + (e.w ? e.w : 30) / 2),
				y:e.y - (e.h ? e.h : -30),
				speed : table == "p" ? -6 : 10,
				tag : table
			};

			this.build('bullets',bullter);
		},

		build(table,data) {// 公共创建
			let _this = this;
			this[table].arr.push( data );
		},

		move(table) {// 公共移动
			for( let i = 0; i < this[table].arr.length; i ++ ){
				let e = this[table].arr[i],
					math = Math.random() * 100,
					speed = this[table].speed ? this[table].speed : 5;

				if ( table == 'bullets' ) speed = e.speed;

				e.y += speed;

				if ( table !== 'bullets' ) {// 如果不是子弹dom的移动
					if( e.y > this.$refs.plane.offsetHeight - 55 ) this[table].arr.splice(i,1);

					if ( table == 'e' && math < 1 ) { this.createButter('e',e); }
				} else {
					if ( e.tag == 'p' ) {
						if ( this.hit_check(e) ) this[table].arr.splice(i,1);
						else if ( e.y < 0 ) this[table].arr.splice(i,1);
					} else {
						if ( this.hit(e,this.p) ) {
							this[table].arr.splice(i,1);
							this.HitTimes++;
						}
						else if ( e.y > this.$refs.plane.offsetHeight - 30 ) this[table].arr.splice(i,1);
					}
				}
			}
		},

		hit_check(b) {// 是否击毁敌军
			for( let i = 0; i < this.e.arr.length; i ++ ){
				if( this.hit(b,this.e.arr[i]) ){
					this.e.arr.splice(i,1);
					this.hitCount++;
					return true;
				}
			}
		},

		hit(b,e) {// 碰撞
			let d = this.judgeHit( b.x, b.y, e.x, e.y );
			if( d < 35 ) return true;
		},

		judgeHit(x1, y1, x2, y2) {// 计算两个点的距离差
			let a = x1 - x2,
				b = y1 - y2,
				result = Math.sqrt( Math.pow( a, 2) + Math.pow( b, 2 ) );
			return Math.round( result );
		},

		pause() {// 暂停
			this.start = false;
			this.timers.forEach(element => { clearInterval(element); })
		}
	},

	watch: {
		username () {// 监听玩家输入事件
			if ( this.username.length > 2 ) this.face = "shy";
			else this.face = "ordinary";
		}
	},

	mounted(){
		let _this = this;
		document.onkeyup = function(e) {
			( e.keyCode == 32 ) && _this.createButter("p",_this.p);
			// ( e.keyCode == 80 ) && _this.pause();
		}
	},

	computed:{ faceChange() { return "image/"+this.face + ".png"; } }
});
