window.el = document.querySelector(".game-plane");
window.data = {
	// 玩家 Player
	p : {
		// 玩家的宽
		w : document.querySelector("#p").offsetWidth,
		// 玩家的高
		h : document.querySelector("#p").offsetHeight,
		// 玩家的边界距离游戏界面水平方向的距离
		x : el.offsetWidth / 2 - document.querySelector("#p").offsetWidth / 2,
		// 玩家的边界距离游戏界面垂直方向的距离
		y : el.offsetHeight - document.querySelector("#p").offsetHeight
	},
	
	// 敌机 enemy plane
	e : {
		arr : [],
		speed : 6,
	},
	
	plane : { arr : [] },   // 星球	
	bullets : { arr : [] }, // 子弹
	hitCount : 0,           // 击中总数
	boom : 0,               // 碰撞次数
	HitTimes : 0,           // 被击中次数
	start : false,          // 游戏是否开始
	positionY : 0,          // 背景 Y 值
	timers : [],            // 定时器
	face : "ordinary",      // 表情
	username : ""           // 玩家名
}