$(document).ready(
    $("#start").click(function(){
       //游戏的重置
       function reset() {
           $("#myPlane").css({"background-image":"url(image/myPlane.png)","left":"220px","bottom":"0"});
           $("#start").css("background-image","url(image/start.png)");
           $(".bullet").remove();
           $(".enemy1").remove();
           $(".weapon").remove();
           $("#scoreShow").hide();
           $("#continue").hide();
           score=0;
           loading=0;
           planeHeath=100;
           $("#score").html("本轮得分：0");
           $("#loading").css("width",loading);
           $("#health").css("width",planeHeath)
       }
       reset();
       //图片的隐藏 hide（）方法
       $("#logo").hide();
       $("#start").hide();
       //定义以下需要的变量
       var n=0;
       var m=0;
       var a=0;
       var myPlane=$("#myPlane");
       var keyDownValue=1;
       var bulletNum=0;
       var bulletHurt;
       var lr=0, tb=0;
       var score=0;
       var loading=0;
       var planeHeath=100;
        $("#health").css("background-color","#ff0000");
       //怒气进度条
       function checkLoading(element,loading) {
           element.css("width",loading);
           if (element.width()<50) element.css("background-color","#ffc0cb") ;
           else if (element.width()>=50&&element.width()<95) element.css("background-color","#ffff00") ;
           else if (element.width()>=95) element.css("background-color","#ff0000") ;
       }
       //怒气释放
       function power() {
           if (loading>=95) {
               loading=0;
               $("#loading").css("width","0");
               myPlane.before("<div id='power'></div>");
               var power1=$("#power");
               clearInterval(bulletInt);
               power1.animate({"bottom":"650px"},5000,"linear", function () {
                   power1.remove();
                   bulletInt=setInterval(bulletRun,300);
               });
               var powerInt=setInterval(function(){
                   var powerTop=power1.position().top;
                   if (powerTop>0) {
                       $(".enemy1").each(function () {
                           var enemy1 = $(this);
                           if ($(this).css("height") == "66px") {
                               if (enemy1.position().top > powerTop - 56) {
                                   enemy1.css("background", "url(image/enemy2Boom.png)");
                                   enemy1.stop();
                                   setTimeout(function () {
                                       enemy1.remove();
                                   }, 50);
                                   score += 200;
                                   $("#score").html("本轮得分：" + score);
                               }
                           }
                           else if (enemy1.css("height") == "172px") {
                               if (enemy1.position().top > powerTop - 172) {
                                   enemy1.css("background", "url(image/enemy3Boom.png)");
                                   enemy1.stop();
                                   setTimeout(function () {
                                       enemy1.remove();
                                   }, 50);
                                   score += 300;
                                   $("#score").html("本轮得分：" + score);
                               }
                           }
                           //其他敌机爆炸
                           else {
                               if (enemy1.position().top > powerTop - 46) {
                                   enemy1.css("background", "url(image/enemy1Boom.png)");
                                   enemy1.stop();
                                   setTimeout(function () {
                                       enemy1.remove();
                                   }, 50);
                                   score += 100;
                                   $("#score").html("本轮得分：" + score);
                               }
                           }
                       })
                   }
               },1);
           }
       }
       //飞机的移动
       $(document).keydown(function(e) {
           var myPlaneLeft=myPlane.position().left;
           var myPlaneTop=myPlane.position().top;
           if (keyDownValue) {
               //向左移动
               if(e.keyCode==37) lr=1;
               //向右移动
               else if (e.keyCode==39) lr=2;
               //向上移动
               else if (e.keyCode==38) tb=1;
               //向下移动
               else if (e.keyCode==40) tb=2;
               //开启怒气
               else if (e.keyCode==32) power();
            }
           $(document).keyup(function(e) {
               //清除移动变量
               if(e.keyCode==37) lr=0;
               else if (e.keyCode==39) lr=0;
               else if (e.keyCode==38) tb=0;
               else if (e.keyCode==40) tb=0;
            });
           for (var i=0;i<1;i++) {
           if (lr==1&&myPlaneLeft>=0) myPlane.css({"left":"-=10px"});
           else if (lr==2&&myPlaneLeft<=500) myPlane.css({"left":"+=10px"});
           if (tb==1&&myPlaneTop>=10) myPlane.css({"bottom":"+=10px"});
           else if (tb==2&&myPlaneTop<=650) myPlane.css({"bottom":"-=10px"});
         }
       });
       //武器的产生
       var weaponInt=setInterval(setWeapon,5000);
       function setWeapon() {
           var weaponId = "weapon" + a;
           myPlane.before("<div class='weapon' id=" + weaponId + "></div>");
           //武器运动和消失
           var weapon=$("#"+weaponId);
           weapon.css("left", function () {
                   return Math.random() * 490+10
               })
               .animate({top: "600px"}, 3000, "linear", function () {
                   $(this).remove();
               });
           a++;
           //吃到武器
           var checkWeapon=setInterval(check2,10);
           function check2() {
               var weaponLeft=weapon.position().left;
               var weaponTop=weapon.position().top;
               var myPlaneLeft=myPlane.position().left;
               var myPlaneTop=myPlane.position().top;
               if (weaponLeft > myPlaneLeft - 45 && weaponLeft < myPlaneLeft + 100 && weaponTop > myPlaneTop - 73 + 60 && weaponTop < myPlaneTop + 121) {
                   $(".weapon").remove();
                   bulletNum>1?bulletNum=2:bulletNum++;
               }
           }
       }
       //子弹发射
       var bulletInt=setInterval(bulletRun,300);
       function bulletRun(){
           var bulletLeft=myPlane.position().left+55;
           var bulletTop=myPlane.position().top;
           n>50?n=0:n++;
           var bulletId="bullet"+n;
           //子弹添加
           var bullet=myPlane.before("<div class='bullet' id="+bulletId+"></div>");
           //子弹的定位，移动和清除
           if (bulletNum==1) {
               bulletHurt=2;
               $("#" + bulletId).css({
                       "left": function () {
                           return bulletLeft-35;
                       },
                       "top": function () {
                           return bulletTop
                       },
                       "background-image":"url(image/bullet2.png)",
                       "width":"70px",
                       "height":"23px"
                   })//子弹运行和消失
                   .animate({top: '0'}, 1000, "linear", function () {
                       $(this).remove();
                   });
               n += 1;
           }
           else if(bulletNum==2){
               bulletHurt=3;
               $("#" + bulletId).css({
                       "left": function () {
                           return bulletLeft-80;
                       },
                       "top": function () {
                           return bulletTop
                       },
                       "background-image":"url(image/bullet3.png)",
                       "width":"160px",
                       "height":"23px"
                   })
                   //子弹运行和消失
                   .animate({top: '0'}, 1000, "linear", function () {
                       $(this).remove();
                   });
               n += 1;
           }
           else if(bulletNum==0){
               bulletHurt=1;
               $("#" + bulletId).css({
                       "left": function () {
                           return bulletLeft;
                       },
                       "top": function () {
                           return bulletTop
                       }
                   })
                   //子弹运行和消失
                   .animate({top: '0'}, 1000, "linear", function () {
                       $(this).remove();
                   });
               n += 1;
           }
       }
       //敌机出现
       var enemyInt=setInterval(setEnemy,1000);
       function setEnemy() {
           var enemy1Id = "enemy1" + m;
           var enemyHeath;
           myPlane.before("<div class='enemy1' id=" + enemy1Id + "></div>");
           //敌机运动和消失
           var enemy1=$("#"+enemy1Id);
           if (m%5==0) {
               enemyHeath=6;
               enemy1.css({"left":function () {
                    return Math.random() * 450+10
               },"background-image":"url(image/enemy2.png)","height":"66px"})
               .animate({top: "600px"}, 10000, "linear", function () {
                   $(this).remove();
               });
            }
            else if (m%11==0) {
              enemyHeath=20;
               enemy1.css({"left":function () {
                    return Math.random() * 350+10
               },"background-image":"url(image/enemy3.png)","height":"172px","width":"108px"})
               .animate({top: "600px"}, 20000, "linear", function () {
                   $(this).remove();
               });
            }
            else {
               enemyHeath=2;
               enemy1.css("left", function () {
                    return Math.random() * 490+10
               })
               .animate({top: "600px"}, 5000, "linear", function () {
                   $(this).remove();
               });
            }
           m>50?m=0:m++; 
            //碰撞检测   
           var checkInt=setInterval(check,1);
           function check(){
               var enemyLeft=enemy1.position().left;
               var enemyTop=enemy1.position().top;
               var myPlaneLeft=myPlane.position().left;
               var myPlaneTop=myPlane.position().top;
               var bullet=$(".bullet");
               function whoBoom() {
                //检测是否是中型敌机爆炸
                if (enemy1.css("height")=="66px") {
                           if (enemyHeath<=0) {
                               enemy1.css("background","url(image/enemy2Boom.png)");
                               enemy1.stop();
                               setTimeout(function(){enemy1.remove();},50);
                               score+=200;
                               loading<100?loading+=20:loading;
                               $("#score").html("本轮得分："+score);
                               checkLoading($("#loading"),loading);
                            }
                            else {
                               enemy1.css("opacity","0.5");
                               setTimeout(function(){enemy1.css("opacity","1");},20);
                               enemyHeath-=bulletHurt;
                            }
                }
                //检测是否是大型敌机爆炸
                else  if(enemy1.css("height")=="172px"){
                           if (enemyHeath<=0) {
                               enemy1.css("background","url(image/enemy3Boom.png)");
                               enemy1.stop();
                               setTimeout(function(){enemy1.remove();},50);
                               score+=300;
                               loading<100?loading+=10:loading;
                               $("#score").html("本轮得分："+score);
                               checkLoading($("#loading"),loading);
                            }
                            else {
                               enemy1.css("opacity","0.5");
                               setTimeout(function(){enemy1.css("opacity","1");},20);
                               enemyHeath-=bulletHurt;
                            }
                      } 
                      //其他敌机爆炸
                else  {
                           if (enemyHeath<=0) {
                               enemy1.css("background","url(image/enemy1Boom.png)");
                               enemy1.stop();
                               setTimeout(function(){enemy1.remove();},50);
                               score+=100;
                               loading<100?loading+=10:loading;
                               $("#score").html("本轮得分："+score);
                               checkLoading($("#loading"),loading);
                            }
                            else {
                               enemy1.css("opacity","0.5");
                               setTimeout(function(){enemy1.css("opacity","1");},20);
                               enemyHeath-=bulletHurt;
                            }
                      } 
               }
               //子弹碰撞
              bullet.each(function () {
                   var bulletLeft=$(this).position().left;
                   var bulletTop=$(this).position().top;
                   //小子弹打小中飞机
                   if (bulletNum==0&&bulletLeft>enemyLeft-5&&bulletLeft<enemyLeft+46&&bulletTop<enemyTop+52&&enemy1.css("height")!="172px") {$(this).remove();whoBoom();}
                   //中性子弹打小中飞机
                   else if(bulletNum==1&&bulletLeft>enemyLeft-70&&bulletLeft<enemyLeft+46&&bulletTop<enemyTop+52&&enemy1.css("height")!="172px") {$(this).remove();whoBoom();}
                   //大子弹打小中飞机
                   else if (bulletNum==2&&bulletLeft>enemyLeft-160&&bulletLeft<enemyLeft+46&&bulletTop<enemyTop+52&&enemy1.css("height")!="172px") {$(this).remove();whoBoom();}
                   //小子弹打大飞机
                   else if (bulletNum==0&&bulletLeft>enemyLeft-5&&bulletLeft<enemyLeft+108&&bulletTop<enemyTop+172&&enemy1.css("height")=="172px") {$(this).remove();whoBoom();}
                   //中子弹打大飞机
                   else if (bulletNum==1&&bulletLeft>enemyLeft-70&&bulletLeft<enemyLeft+108&&bulletTop<enemyTop+172&&enemy1.css("height")=="172px") {$(this).remove();whoBoom();}
                   //大子弹打大飞机
                   else if (bulletNum==2&&bulletLeft>enemyLeft-160&&bulletLeft<enemyLeft+108&&bulletTop<enemyTop+172&&enemy1.css("height")=="172px") {$(this).remove();whoBoom();}
               });
               //飞机碰撞
               if (enemyLeft>myPlaneLeft-40&&enemyLeft<myPlaneLeft+100&&enemyTop>myPlaneTop-52+60&&enemyTop<myPlaneTop+121) {
                   if (enemy1.css("height")=="66px") enemy1.css({"background-image":"url(image/enemy2Boom.png)"});
                   else if (enemy1.css("height")=="172px") enemy1.css({"background-image":"url(image/enemy3Boom.png)"});
                   else  enemy1.css({"background-image":"url(image/enemy1Boom.png)"});
                   enemy1.stop();
                   enemy1.remove();
                   if (planeHeath<=25) {
                       clearInterval(checkInt);
                       clearInterval(enemyInt);
                       clearInterval(bulletInt);
                       clearInterval(weaponInt);
                       keyDownValue = 0;
                       loading = 0;
                       lr = 0;
                       tb = 0;
                       $("#health").css("width","0px");
                       $(".enemy1").stop();
                       $(".weapon").stop();
                       myPlane.css("background-image", "url(image/myPlaneBoom.png)");
                       $("#start").css("background-image", "url(image/restart.png)").show();
                       $("#scoreShow").html("本轮得分：" + score).show();
                   }
                   else planeHeath-=25;
                   var health=$("#health");
                   health.css({"width":planeHeath});
                   if (40<planeHeath<50) console.log(planeHeath);//health.css("background-color","#ffff00");
                   else if (planeHeath<=40) health.css("background-color","#ff0000");
               }
         }
       }
       //暂停
       $("#pause").click(function () {
           $(".enemy1").stop();
           $(".weapon").stop();
           $(".bullet").stop();
           $("#power").stop();
           clearInterval(enemyInt);
           clearInterval(bulletInt);
           clearInterval(weaponInt);
           lr=0;
           tb=0;
           keyDownValue=0;
           $("#start").css("background-image","url(image/restart.png)").show()
               .after("<div id='continue'></div>");
           //重新开始
           $("#continue").click(function(){
               enemyInt=setInterval(setEnemy,1000);
               bulletInt=setInterval(bulletRun,1000);
               weaponInt=setInterval(setWeapon,5000);
               keyDownValue=1;
               $(".enemy1").animate({top: "600px"}, 10000, "linear", function () {
                   $(this).remove();
               });
               $(".weapon").animate({top: "600px"}, 3000, "linear", function () {
                   $(this).remove();
               });
               $(".bullet").animate({top: '0'}, 1000, "linear", function () {
                   $(this).remove();
               });
               $("#power").animate({top: '0'}, 1000, "linear", function () {
                   $(this).remove();
               });
               $("#start").hide();
               $("#continue").hide();
           })

       })
   })
);
