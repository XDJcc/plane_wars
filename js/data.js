window.el = document.querySelector(".game-plane");
window.data = {
	p : {// 玩家 Player
		w : document.querySelector("#p").offsetWidth,
		h : document.querySelector("#p").offsetHeight,
		x : el.offsetWidth / 2 - document.querySelector("#p").offsetWidth / 2,
		y : el.offsetHeight - document.querySelector("#p").offsetHeight
	},
	
	e : {// 敌机 enemy plane
		arr : [],
		speed : 6,
	},
	
	plane : { arr : [] },// 星球	
	bullets : { arr : [] },// 子弹
	hitCount : 0,// 击中总数
	boom : 0,// 碰撞次数
	HitTimes : 0,// 被击中次数
	start : false,// 游戏是否开始
	positionY : 0,// 背景 Y 值
	timers : [],// 定时器
	face : "ordinary",// 表情
	username : "" // 玩家名
}