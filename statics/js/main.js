/**
 * Main Javascript
 */

var w,h;
var ua = navigator.userAgent;
var isWeixin = ua.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var loadingComplete = false;
var loadingCron, page3Cron, page4Cron, horviewCron;
var v1, bg_audio;
var playingAudio = true, isFirstPlayVideo = true;
var num;
var isEnabledTouchPage = true;
var isIphoneX = /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375);
// iphoneX的px
var iphoneXH;
// 滑动页面的初始化margin距离
var initMarginTop;

function initScreen() {
	w = $(window).width();
	h = $(window).height();
    $("html").css("font-size",w/640*100+"px");
	$('body').show();
	$(".container").height(h);
	iphoneXH = $(".iphoneX").height();
	$(".page-body .container").css("height", "12.36rem");
	initMarginTop = (iphoneXH-h)/2;
	$('.page-body').css({"margin-top":-initMarginTop+'px'});
	
	// 特殊机型
	if (640*h < 1000*w) {
		$('.home.iphoneX').addClass('special');
		$('.page6 .content').addClass('special');
	}
}

$(window).resize(function(){
	initScreen();
	$('.page-body').css({"margin-top": -(initMarginTop+(num-1)*iphoneXH)+'px'});
});

// 锁屏提示
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function (e) {
	_onorientationchange(e);
}, false);

$(function(){
	initScreen();
	preload();
	
	// 禁止上下滑动
	$('body').on('touchmove', function (event) {
		event.preventDefault();
	});
	
	// 序列帧动画
	//frameAnimate('page3-sprite', 30, 20, true, 'png', 1, 1);
	
	// 立即办卡
	var canvidControl1 = canvid({
		selector : '.register-btn-1',
		videos: {
			clip: { src: statics_url+'images/register_sprite.png', frames: 60, cols: 10, loops: 1, fps: 20, onEnd: function(){
				canvidControl1.play('clip');
			}}
		},
		width: 78,
		height: 270,
		loaded: function() {
			canvidControl1.play('clip');
		}
	});
	var canvidControl2 = canvid({
		selector : '.register-btn-2',
		videos: {
			clip: { src: statics_url+'images/register_sprite.png', frames: 60, cols: 10, loops: 1, fps: 20, onEnd: function(){
				canvidControl2.play('clip');
			}}
		},
		width: 78,
		height: 270,
		loaded: function() {
			canvidControl2.play('clip');
		}
	});
	var canvidControl3 = canvid({
		selector : '.register-btn-3',
		videos: {
			clip: { src: statics_url+'images/register_sprite.png', frames: 60, cols: 10, loops: 1, fps: 20, onEnd: function(){
				canvidControl3.play('clip');
			}}
		},
		width: 78,
		height: 270,
		loaded: function() {
			canvidControl3.play('clip');
		}
	});
	var canvidControl4 = canvid({
		selector : '.register-btn-4',
		videos: {
			clip: { src: statics_url+'images/register_sprite.png', frames: 60, cols: 10, loops: 1, fps: 20, onEnd: function(){
				canvidControl4.play('clip');
			}}
		},
		width: 78,
		height: 270,
		loaded: function() {
			canvidControl4.play('clip');
		}
	});
	var canvidControl5 = canvid({
		selector : '.register-btn-5',
		videos: {
			clip: { src: statics_url+'images/register_sprite.png', frames: 60, cols: 10, loops: 1, fps: 20, onEnd: function(){
				canvidControl5.play('clip');
			}}
		},
		width: 78,
		height: 270,
		loaded: function() {
			canvidControl5.play('clip');
		}
	});
	
	v1 = document.getElementById('v1');
	bg_audio = document.getElementById('bg-audio');
	
	// 微信专属
	document.addEventListener("WeixinJSBridgeReady", function () {
		bg_audio.play();
	});
	
	// 背景音乐
	$('.music-btn').click(function(){
		if ($(this).hasClass('on')) {
			$('.music-btn').removeClass('on').addClass('off');
			bg_audio.pause();
			playingAudio = false;
		} else {
			$('.music-btn').removeClass('off').addClass('on');
			bg_audio.play();
			playingAudio = true;
		}
	});
	
	// 视频播放
	$('.video-btn').on('click', function(){
		console.log('video play');
		videoPlay();
	});
	
	// 视频暂停
	if (isIOS) {
		$('.video-box').on('click', function(){
			console.log('video pause');
			videoPause();
		});
	}
	
	// 视频播放完成
	v1.addEventListener('ended', function(){
		console.log('video ended');
		videoEnd();
	}, false);
	
	// 微信X5
	v1.addEventListener("x5videoenterfullscreen", function(){
		isEnabledTouchPage = false;
		$('.video-tips').hide();
	});
	v1.addEventListener("x5videoexitfullscreen", function(){
		videoEnd();
		isEnabledTouchPage = true;
		$('.video-tips').show();
	})
	
	// 滑动翻页
	num = 1;
	var isMove = true;
	var moveUp = false;
	var moveDown = true;
	var firstY;
	var moveY = 0;
	var initTop;
	
	$('.page-body').on('touchstart', function(e){
		moveY = 0;
		firstY = window.event.touches[0].pageY;
		// 非微信触发
		if (num == 1 & playingAudio) {
			bg_audio.play();
		}
		initTop = parseInt($('.page-body').css("margin-top"));
	});
	$('.page-body').on('touchmove', function(e){
		moveY = window.event.touches[0].pageY-firstY;
		if (num == 1 & moveY > 0) {
			// 第一页下滑
		} else if (num == 7 & moveY < 0) {
			// 最后一页上滑
		} else {
			//$('.page-body').css({"margin-top":(initTop+moveY)+"px"});
		}
	});
	$('.page-body').on('touchend', function(e) {
		if (!isEnabledTouchPage) return false;
		if (moveY <= -50 || moveY >= 50) {
			if (moveY < 0) { // 上滑
				if (num == 7) return false;
				$('.page-body').animate({
					"margin-top": -(initMarginTop+num*iphoneXH)+'px'
				}, 500);
				num++;
				switch (num) {
					// 1->2
					case 2:
						page2_animate();
					break;
					
					// 2->3
					case 3:
						page3_animate();
					break;
					
					// 3->4
					case 4:
						page4_animate();
					break;
					
					// 4->5
					case 5:
						page5_1_animate();
					break;
					
					// 5->6
					case 6:
						page5_2_animate();
					break;
					
					// 6->7
					case 7:
						page6_animate();
					break;
				}
			} else { // 下滑
				if (num == 1) return false;
				num--;
				$('.page-body').animate({
					"margin-top": -(initMarginTop+(num-1)*iphoneXH)+'px'
				}, 500);
				switch (num) {
					// 2->1
					case 1:
						page1_animate();
						v1.pause();
					break;
					
					// 3->2
					case 2:
						page2_animate();
					break;
					
					// 4->3
					case 3:
						page3_animate();
					break;
					
					// 5->4
					case 4:
						page4_animate();
					break;
					
					// 6->5
					case 5:
						page5_1_animate();
					break;
					
					// 7->6
					case 6:
						page5_2_animate();
					break;
				}
			}
			console.log(num);
		} else {
			$('.page-body').animate({
				"margin-top": initTop+'px'
			}, 200);
		}
	});
});

function page1_animate() {
	if (!isFirstPlayVideo) {
		videoPause();
	}
	$('.tips, .video-tips').hide();
	$('.slogan').removeClass('fadeInUp');
	setTimeout(function(){
		$('.slogan').addClass('fadeInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.page1').find('.tips').fadeIn(300, function(){
				$('.page1').find('.tips').addClass('zTip');
			});
		});
	}, 300);
}
function page2_animate() {
	clearInterval(page3Cron);
	if (isIOS & !isFirstPlayVideo) {
		//videoPlay();
	}
	// video-tips  就是每一页下面的箭头
	$('.tips, .video-tips').hide();
	setTimeout(function(){
		$('.page2').find('.video-tips').fadeIn(300, function(){
			$('.page2').find('.video-tips').addClass('zVideoTip');
		});
	}, 500);
}
function page3_animate() {
	if (!isFirstPlayVideo) {
		videoPause();
	}
	clearInterval(page4Cron);
	page3Cron = sequenceFrameAnimate('page3-sprite', 30, 50, true, 'png', 1);
	$('.tips, .video-tips').hide();
	$('.tree-1').removeClass('fadeInLeft');
	$('.tree-2').removeClass('fadeInRight');
	$('.card-1').removeClass('fadeInLeft');
	$('.card-2').removeClass('fadeInRight');
	$('.huba').removeClass('zFadeIn');
	$('.page3 .register').hide();
	setTimeout(function(){
		$('.tree-1').addClass('fadeInLeft');
		$('.tree-2').addClass('fadeInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.card-1').addClass('fadeInLeft');
			$('.card-2').addClass('fadeInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$('.huba').addClass('zFadeIn');
				$('.page3 .register').fadeIn(500);
				$('.page3').find('.video-tips').fadeIn(300, function(){
					$('.page3').find('.video-tips').addClass('zVideoTip');
				});
			});
		});
	}, 500);
}
function page4_animate() {
	clearInterval(page3Cron);
	page4Cron = sequenceFrameAnimate('page4-sprite', 30, 50, true, 'png', 1);
	$('.page4 .title').removeClass('fadeInUp');
	$('.page4 .description').removeClass('fadeInDown');
	$('.tips, .video-tips').hide();
	$('.page4 .register').hide();
	setTimeout(function(){
		$('.page4 .title').addClass('fadeInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.page4 .description').addClass('fadeInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$('.page4 .register').fadeIn(500);
				$('.page4').find('.tips').fadeIn(300, function(){
					$('.page4').find('.tips').addClass('zTip');
				});
			});
		});
	}, 500);
}
function page5_1_animate() {
	clearInterval(page4Cron);
	$('.page5-1 .description').removeClass('zFadeIn');
	$('.tips, .video-tips').hide();
	$('.mon, .tues, .wed').removeClass('zFadeIn');
	$('.page5-1 .register').hide();
	setTimeout(function(){
		$('.page5-1 .description').addClass('zFadeIn');
		$('.mon, .tues, .wed').addClass('zFadeIn');
		$('.wed').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.page5-1 .register').fadeIn(500);
			$('.page5-1').find('.tips').fadeIn(300, function(){
				$('.page5-1').find('.tips').addClass('zTip');
			});
		});
	}, 500);
}
function page5_2_animate() {
	$('.tips, .video-tips').hide();
	$('.thur, .fri, .sat, .sun').removeClass('zFadeIn');
	$('.page5-2 .register').hide();
	setTimeout(function(){
		$('.thur, .fri, .sat, .sun').addClass('zFadeIn');
		$('.sun').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.page5-2 .register').fadeIn(500);
			$('.page5-2').find('.tips').fadeIn(300, function(){
				$('.page5-2').find('.tips').addClass('zTip');
			});
		});
	}, 500);
}
function page6_animate() {
	$('.page6 .register').hide();
	setTimeout(function(){
		$('.page6 .register').fadeIn(500);
	}, 500);
}

/**
 * 序列帧动画
 */
function sequenceFrameAnimate(name, count, time, isRepeat, type, repeatNum) {
	if (!repeatNum) repeatNum = 1;
	var i = 1;
	var cron = setInterval(function(){
		$('.'+name+' img').attr("src", statics_url+'images/'+name+'/'+i+'.'+type);
		if (i == count) {
			// 循环播放
			if (isRepeat) {
				i = repeatNum;
			} else {
				clearInterval(cron);
			}
			return;
		};
		i++;
	}, time);
	return cron;
}

/**
 * 序列帧动画Frame版
 */
function frameAnimate(name, count, fps, isRepeat, type, repeatNum, startNum) {
	if (!repeatNum) repeatNum = 1;
	if (!startNum) startNum = 1;
	var diff = parseInt(60/fps);
	var i = parseInt(startNum/diff)+1;
	$('.'+name+' img').attr("src", statics_url+'images/'+name+'/'+i+'.'+type);
	if (i == count) {
		// 循环播放
		if (isRepeat) {
			startNum = repeatNum;
		} else {
			cancelAnimationFrame(stop);
			return false;
		}
	} else {
		startNum++;
	}
	var stop = requestAnimationFrame(function() {
		frameAnimate(name, count, fps, isRepeat, type, repeatNum, startNum);
	});
	return stop;
}

/**
 * 画布绘制视频
 */
function drawVideo(v, c, c2, w, h) {
	if(v.paused || v.ended) {
		cancelAnimationFrame(stop);
		return false;
	}
	c2.drawImage(v, 0, -375, w, h);
	var stop = requestAnimationFrame(function() {
		drawVideo(v, c, c2, w, h);
	});
}

function preload() {
	var manifest = [
		statics_url+'images/loading_bg.jpg',
		statics_url+'images/percent_text.png',
		statics_url+'images/loading-sprite/1.png',
		statics_url+'images/loading-sprite/2.png',
		statics_url+'images/loading-sprite/3.png',
		statics_url+'images/loading-sprite/4.png',
		statics_url+'images/loading-sprite/5.png',
		statics_url+'images/loading-sprite/6.png',
		statics_url+'images/loading-sprite/7.png',
		statics_url+'images/loading-sprite/8.png',
		statics_url+'images/loading-sprite/9.png',
		statics_url+'images/loading-sprite/10.png',
		statics_url+'images/loading-sprite/11.png',
		statics_url+'images/loading-sprite/12.png',
		statics_url+'images/loading-sprite/13.png',
		statics_url+'images/loading-sprite/14.png',
		statics_url+'images/loading-sprite/15.png',
		statics_url+'images/loading-sprite/16.png',
		statics_url+'images/loading-sprite/17.png',
		statics_url+'images/loading-sprite/18.png',
		statics_url+'images/loading-sprite/19.png',
		statics_url+'images/loading-sprite/20.png',
		statics_url+'images/loading-sprite/21.png',
		statics_url+'images/loading-sprite/22.png',
		statics_url+'images/loading-sprite/23.png',
		statics_url+'images/loading-sprite/24.png',
		statics_url+'images/loading-sprite/25.png',
		statics_url+'images/loading-sprite/26.png',
		statics_url+'images/loading-sprite/27.png',
		statics_url+'images/loading-sprite/28.png',
		statics_url+'images/loading-sprite/29.png',
		statics_url+'images/loading-sprite/30.png',
		statics_url+'images/card_1.png',
		statics_url+'images/card_2.png',
		statics_url+'images/clapboard.png',
		statics_url+'images/fri.png',
		statics_url+'images/huba.png',
		statics_url+'images/mon.png',
		statics_url+'images/music_off_btn.png',
		statics_url+'images/music_on_btn.png',
		statics_url+'images/page1_bg.jpg',
		statics_url+'images/page1_bg2.jpg',
		statics_url+'images/page3_bg.jpg',
		statics_url+'images/page4_bg.jpg',
		statics_url+'images/page4_description.png',
		statics_url+'images/page4_title.png',
		statics_url+'images/page5_1_bg.jpg',
		statics_url+'images/page5_2_bg.jpg',
		statics_url+'images/page5_description.png',
		statics_url+'images/page6_bg.jpg',
		statics_url+'images/page6_bg2.jpg',
		statics_url+'images/pause_btn.png',
		statics_url+'images/play_btn.png',
		statics_url+'images/register_sprite.png',
		statics_url+'images/sat.png',
		statics_url+'images/signboard.png',
		statics_url+'images/slogan.png',
		statics_url+'images/sun.png',
		statics_url+'images/thur.png',
		statics_url+'images/tips.png',
		statics_url+'images/tree_1.png',
		statics_url+'images/tree_2.png',
		statics_url+'images/tues.png',
		statics_url+'images/video_pic.jpg',
		statics_url+'images/video_tips.png',
		statics_url+'images/wed.png',
	];
	for (var i=1; i<=30; i++) {
		manifest.push(statics_url+'images/page3-sprite/'+i+'.png');
		manifest.push(statics_url+'images/page4-sprite/'+i+'.png');
	}
	
	var preload = new createjs.LoadQueue(false);
	startPreload();
	
	// 预加载方法
	function startPreload() {
		// 注意加载音/视频文件需要调用如下代码行
		preload.setMaxConnections(10);
		preload.maintainScriptOrder=true;
		//preload.installPlugin(createjs.Sound); 
		//preload.installPlugin(createjs.Video);               
		preload.on("fileload", handleFileLoad);
		preload.on("progress", handleFileProgress);
		preload.on("complete", loadComplete);
		preload.on("error", loadError);
		preload.loadManifest(manifest);
	}
	
	// 处理单个文件加载
	function handleFileLoad(event) {
		// Loading动画加载过程
		if (event.item.src == statics_url+'images/percent_text.png') {
			console.log('loading show');
			$('.loading').show();
		}
		if (event.item.src == statics_url+'images/loading-sprite/30.png') {
			console.log('loading sprite start');
			loadingCron = sequenceFrameAnimate('loading-sprite', 30, 50, true, 'png', 1);
		}
	}
	
	// 处理加载错误
	function loadError(evt) {
		//console.log("加载出错！",evt.text);
	}
	
	// 已加载完毕进度 
	function handleFileProgress(event) {
		var pro = preload.progress*100|0;
		$('.percent span').text(pro);
	}
	
	// 全部资源加载完毕
	function loadComplete(event) {
		$('.loading').hide();
		$('.page-body').show();
		page1_animate();
		clearInterval(loadingCron);
		loadingComplete = true;
		console.log('loading complete');
	}
}

function _onorientationchange(e){
    if(window.orientation==90||window.orientation==-90){
        $("#forhorview").css("display", "-webkit-box");
		horviewCron = sequenceFrameAnimate('forhorview-sprite', 30, 40, true, 'png', 1);
    }else{
        $("#forhorview").css("display", "none");
		clearInterval(horviewCron);
    }
}

function videoPlay() {
	v1.play();
	isFirstPlayVideo = false;
	bg_audio.pause();
	$('.video-box').show();
	$('.video-control').hide();
}
function videoPause() {
	v1.pause();
	if (playingAudio) {
		bg_audio.play();
	}
	$('.video-control').show();
	$('.video-pic').hide();
	//$('.video-btn').removeClass('play').addClass('pause');
}
function videoEnd() {
	isFirstPlayVideo = true;
	$('.video-box').hide();
	$('.video-control').show();
	$('.video-pic').show();
	//$('.video-btn').removeClass('pause').addClass('play');
	if (playingAudio) {
		bg_audio.play();
	}
}