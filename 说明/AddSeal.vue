<template>
	<div id = "Addsealadmin">
		<div class="frame">
			<div class="center">
				<div class="profile">
					<div class="name">PDF转图片</div>
					<div class="actions">
							<a href="javascript:;" class="btn file">选择 Pdf
								<input id='pdf' @change="change()" type='file' accept="application/pdf">
							</a>
							<button class="btn" id="stamp" disabled="disabled" @click="Addseal">盖章</button>
							<button class="btn" id="view" disabled="disabled" @click="view_canvas_main">预览</button>
							<button class="btn" id="download" disabled="disabled" @click="pdfdownload">下载</button>
							<!-- <button class="btn" id="export">Change Image</button> -->
					</div>
				</div>
			</div>
		</div>
		<div id="imgDiv"></div>
		<div id="imgDiv1"></div>
		<div id="canvasDiv" @click="clickSeal" @mousedown="DisplayCoord"></div>
		<div id="canvasDivz"></div>
		<div id="sealDiv"></div>
	</div>
</template>
<script>
	import '../../api/AddSeal_js/pdf.js'
	import '../../api/AddSeal_js/jquery-2.1.4.min.js'
	import '../../api/AddSeal_js/pdf.worker.js'
	import '../../api/AddSeal_js/jspdf.debug.js'
	// import	'../common/AddSeal_js/index.js'

	export default {
		name: "AddSeal",
		methods: {
			change() {
				let pdfFileURL = $('#pdf').val();
				if (pdfFileURL) {
					$("#imgDiv").empty(); //清空上一PDF文件展示图
					$("#imgDiv1").empty();
					$("#canvasDiv").empty();
					$('#canvasDivz').empty();
					$('#sealDiv').empty();

					$("#imgDiv").show();
					$("#imgDiv1").show();
					$("#canvasDivz").hide();
					let files = $('#pdf').prop('files'); //获取到文件
					let fileSize = files[0].size;

					$("#stamp").removeAttr("disabled", "disabled");

					/*pdf.js无法直接打开本地文件,所以利用FileReader转换*/
					let reader = new FileReader();
					reader.readAsArrayBuffer(files[0]);
					reader.onload = function(e) {
						let myData = new Uint8Array(e.target.result)
						let docInitParams = {
							data: myData
						};
						let typedarray = new Uint8Array(this.result);
						PDFJS.getDocument(typedarray).then(function(pdf) { //PDF转换为canvas
							$("#imgDiv").css("border", "0"); //清除文本、边框
							$("#imgDiv1").css("border", "0");
							$("#imgDiv2").css("border", "0");
							if (pdf) {
								let pageNum = pdf.numPages;
								let pagetest = pageNum;
								let pdfFile = pdf;
								$("#pagesText").text(pageNum);

								for (let i = 1; i <= pageNum; i++) {
									let canvas = document.createElement('canvas');
									canvas.id = "pageNum" + i;
									let number = i;
									let scale = 2;
									$("#imgDiv").append(canvas);
									let context = canvas.getContext('2d');
									// this.openPage(pdf, i, context);
									pdfFile.getPage(number).then(function(page) {
										let img = document.createElement("img");
										let viewport = page.getViewport(scale); // reference canvas via context
										let canvas = context.canvas;
										canvas.width = viewport.width;
										canvas.height = viewport.height;
										canvas.style.width = "100%";
										canvas.style.height = "100%";
										let renderContext = {
											canvasContext: context,
											viewport: viewport
										};
										page.render(renderContext);
									});
								}
							}
						});
					};
				}
			},
			Addseal() {
				$("#view").removeAttr("disabled", "disabled");
				var div = document.getElementById("canvasDiv");
				let pagetest = $("#imgDiv").children("canvas").length;
				// console.log(pagetest);
				$("#canvasDiv").show();
				$("canvas").each(function(index, ele) {
					var canvas = document.getElementById("pageNum" + (pagetest - index));
					//新Image对象，可以理解为DOM
					var img = new Image();
					// canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
					// 指定格式PNG
					img.src = canvas.toDataURL("image/png");
					img.id = "img" + (index + 1);
					$('#imgDiv1').append(img);
					var img = document.getElementById(img.id);
					img.onload = function() {
						var man1 = document.getElementById("seal");
						var canvas1 = document.createElement('canvas');
						canvas1.id = "canvas" + (index + 1);
						canvas1.width = img.width;
						canvas1.height = img.height;
						div.style.width = img.width + 'px';
						canvas1.style.width = "100%";
						canvas1.style.height = "100%";
						var ctx = canvas1.getContext("2d");
						ctx.drawImage(img, 0, 0);
						$('#canvasDiv').append(canvas1);
					}
				})
				$("#imgDiv").hide();
				$("#imgDiv1").hide();
				$("#imgDiv").empty();
				$("#imgDiv1").empty();
				this.createSeal();
				$("#sealDiv").hide();
			},
			createSeal() {
				var canvas = document.createElement('canvas');
				canvas.id = "seal";
				$("#sealDiv").append(canvas);
				var context = canvas.getContext('2d');
				var text = "华南理工大学广州学院";
				var text1 = "华南理工大学广州学院";

				// 绘制印章边框     
				var width = canvas.width / 2;
				var height = canvas.height / 2;
				context.lineWidth = 7;
				context.strokeStyle = "#f00";
				context.beginPath();
				context.arc(width, height, 70, 0, Math.PI * 2);
				context.stroke();

				//画五角星  
				this.create5star(context, width, height, 20, "#f00", 0);

				// 绘制印章名称     
				// context.font = '8px 宋体';
				context.textBaseline = 'middle'; //设置文本的垂直对齐方式  
				context.textAlign = 'center'; //设置文本的水平对对齐方式  
				context.lineWidth = 1.2;
				context.strokeStyle = '#f00';
				// context.strokeText(text, width, height + 40);

				// 绘制印章单位     
				context.translate(width, height); // 平移到此位置,  
				context.font = '22px 宋体'
				var count = text1.length; // 字数     
				var angle = 4 * Math.PI / (3 * (count - 1)); // 字间角度     
				var chars = text1.split("");
				var c;
				for (var i = 0; i < count; i++) {
					c = chars[i]; // 需要绘制的字符     
					if (i == 0) context.rotate(5 * Math.PI / 6);
					else
						context.rotate(angle); //   
					context.save();
					context.translate(50, 0); // 平移到此位置,此时字和x轴垂直     
					context.rotate(Math.PI / 2); // 旋转90度,让字平行于x轴     
					context.strokeText(c, 0, 0); // 此点为字的中心点     
					context.restore();
				}
			},
			create5star(context, sx, sy, radius, color, rotato) {
				context.save();
				context.fillStyle = color;
				context.translate(sx, sy); //移动坐标原点    
				context.rotate(Math.PI + rotato); //旋转    
				context.beginPath(); //创建路径    
				var x = Math.sin(0);
				var y = Math.cos(0);
				var dig = Math.PI / 5 * 4;
				for (var i = 0; i < 5; i++) { //画五角星的五条边    
					var x = Math.sin(i * dig);
					var y = Math.cos(i * dig);
					context.lineTo(x * radius, y * radius);
				}
				context.closePath();
				context.stroke();
				context.fill();
				context.restore();
			},
			createImg() {
				if (!($("#img").length > 0)) {
					var canvas = document.getElementById("canvas1");
					var img = new Image();
					// canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
					// 指定格式PNG
					img.src = canvas.toDataURL("image/png");
					// var img = convertCanvasToImage(canvas);
					img.id = "img";
					$('#canvasDiv').append(img);
					$("#img").hide();
					var img = document.getElementById(img.id);
					var ctx = canvas.getContext("2d");
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					var img1 = img;
					console.log(img1)
				} else {
					var img1 = document.getElementById("img");
				}
				return img1;
			},
			clickSeal(e) {
				// alert('111');

				var img1 = this.createImg();
				let element = document.getElementById('scroll');
				let header = $('.header');
				let sidebar = $('.sidebar');
				var x = e.pageX + element.scrollLeft - sidebar.outerWidth(true),
					y = e.pageY + element.scrollTop - header.outerHeight(true);
				console.log(x, y);
				// alert("1111");

				if (y <= img1.height) {
					var man1 = document.getElementById("seal");
					// console.log(img.width);
					var canvas = document.getElementById("canvas1");
					canvas.width = img1.width;
					canvas.height = img1.height;
					// console.log(canvas.width, canvas.height)
					canvas.style.width = "100%";
					canvas.style.height = "100%";
					var ctx = canvas.getContext("2d");
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(img1, 0, 0);
					ctx.globalAlpha = 0.8; // 设置图片透明度
					ctx.drawImage(man1, x - 160, y - 110); // 加图片，数字签章 
				}

			},

			view_canvas(j) {
				var canvas = document.getElementById("canvas" + j)
				var img = new Image();
				// canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
				// 指定格式PNG
				img.src = canvas.toDataURL("image/png");
				// var img = convertCanvasToImage(canvas);
				img.id = "img" + j;
				$('#imgDiv1').append(img);
				var img = document.getElementById(img.id);
				img.onload = function() {
					var man1 = document.getElementById("seal");
					// console.log(img.width);
					var canvas1 = document.createElement('canvas');
					canvas1.id = "download" + j;
					canvas1.width = img.width;
					canvas1.height = img.height;
					canvas1.style.width = "100%";
					canvas1.style.height = "100%";
					$('#canvasDivz').append(canvas1);
					var ctx = canvas1.getContext("2d");
					ctx.drawImage(img, 0, 0);
					// $('#canvasDivz').append(canvas1);
				}
			},
			
			//预览pdf文件
			view_canvas_main() {
				// let pagetest = $("#canvasDiv").children("canvas").length - 1;
				$("#stamp").attr("disabled", "disabled"); //禁用盖章按钮
				$("#download").removeAttr("disabled", "disabled");
				$("#imgDiv").empty();
				$("#imgDiv1").empty();
				$("#canvasDivz").show();
				$("#canvasDiv").hide();
				let pagetest = $("#canvasDiv").children("canvas").length;
				var doc = new jsPDF()
				for (let i = 1; i <= pagetest; i++) {
					var j = pagetest - i + 1;
					this.view_canvas(j);
				}
				$("#canvasDiv").empty();
				$("#imgDiv1").empty();
			},
			
			// 下载pdf
			pdfdownload() {
				$("#view").attr("disabled", "disabled"); //禁用预览按钮
				// $("#download").attr("disabled", "disabled"); //禁用下载按钮
				var doc = new jsPDF('p', 'pt', 'a4')
				var pdfWidth = 595;
				let pagetest = $("#canvasDivz").children("canvas").length;
				for (let i = 1; i <= pagetest; i++) {
					
					var canvas = document.getElementById("download" + (pagetest - i + 1))
					var imgData = new Image();
					imgData.src = canvas.toDataURL("image/png");
					doc.addImage(imgData, 'PNG', 0, 50, pdfWidth, pdfWidth / canvas.width * canvas.height)
					if (i < pagetest) {
						console.log(i,pagetest);
						doc.addPage()
					}
				}
				
				doc.save('save.pdf');
				setTimeout(function(){
				  location.reload();
				},2000)
			},
		},
	};
</script>
<style>
	#operator {
		position: fixed;
		margin: 20px;
	}

	.file {
		position: relative;
		display: inline-block;
		background: #D0EEFF;
		border: 1px solid #99D3F5;
		border-radius: 4px;
		padding: 4px 12px;
		overflow: hidden;
		color: #1E88C7;
		text-decoration: none;
		text-indent: 0;
		line-height: 20px;
	}

	.file input {
		position: absolute;
		font-size: 100px;
		right: 0;
		top: 0;
		opacity: 0;
	}

	.file:hover {
		background: #AADFFD;
		border-color: #78C3F3;
		color: #004974;
		text-decoration: none;
	}

	#imgDiv {
		margin: 0 auto;
		width: 650px;
		min-height: 800px;
		border: 1px solid #CA7C4E;
		border-radius: 10px;
		text-align: center;
	}

	#imgDiv1 {
		position: absolute;
		top: 0px;
		left: 433px;
		margin: 0 auto;
		width: 650px;
		min-height: 800px;
		border: 1px #CA7C4E;
		border-radius: 10px;
		text-align: center;
	}

	#imgDiv1 img {
		position: relative;
		top: -100px;
		left: -50px;
	}

	#sealDiv {
		width: 100%;
		height: 100%;
	}
	#canvasDivz {
		position: relative;
		top: 0px;
		left: 5%;
		margin: 0 auto;
		width: 650px;
		min-height: 800px;
		border: 1px #CA7C4E;
		border-radius: 10px;
		text-align: center;
	}

	#seal {
		border: 0;
		/* display:none; */
		width: 200px;
		height: 100px;
	}

	canvas {
		width: 1000px;
		border-radius: 10px;
		border: 1px solid #CA7C4E;
		margin: 0px;
	}

	/* style */
	.frame {
		position: fixed;
		left: 85%;
		width: 180px;
		height: 250px;
		border-radius: 2px;
		box-shadow: 1px 2px 10px 0px rgba(0, 0, 0, 0.3);
		background: #CA7C4E;
		background: -webkit-linear-gradient(bottom left, #EEBE6C 0%, #CA7C4E 100%);
		background: linear-gradient(to top right, #EEBE6C 0%, #CA7C4E 100%);
		filter: progid: DXImageTransform.Microsoft.gradient(startColorstr='#EEBE6C', endColorstr='#CA7C4E', GradientType=1);
		color: #786450;
		font-family: 'Open Sans', Helvetica, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.center {
		position: absolute;
		top: 10px;
		left: 10px;
		height: 230px;
		width: 160px;
		background: #fff;
		border-radius: 3px;
		overflow: hidden;
		box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, 0.3);
	}

	.profile {
		float: left;
		width: 160px;
		height: 350px;
		text-align: center;
	}

	.profile .image {
		position: relative;
		width: 70px;
		height: 70px;
		margin: 38px auto 0 auto;
	}

	.profile .image .circle-1,
	.profile .image .circle-2 {
		position: absolute;
		box-sizing: border-box;
		width: 76px;
		height: 76px;
		top: -3px;
		left: -3px;
		border-width: 1px;
		border-style: solid;
		border-color: #786450 #786450 #786450 transparent;
		border-radius: 50%;
		-webkit-transition: all 1.5s ease-in-out;
		transition: all 1.5s ease-in-out;
	}

	.profile .image .circle-2 {
		width: 82px;
		height: 82px;
		top: -6px;
		left: -6px;
		border-color: #786450 transparent #786450 #786450;
	}

	.profile .image img {
		display: block;
		border-radius: 50%;
		background: #F5E8DF;
	}

	.profile .image:hover {
		cursor: pointer;
	}

	.profile .image:hover .circle-1,
	.profile .image:hover .circle-2 {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}

	.profile .image:hover .circle-2 {
		-webkit-transform: rotate(-360deg);
		transform: rotate(-360deg);
	}

	.profile .name {
		font-size: 15px;
		font-weight: 600;
		margin-top: 20px;
	}

	.profile .job {
		font-size: 11px;
		line-height: 15px;
	}

	.profile .actions {
		margin-top: 20px;
	}

	.profile .actions .btn {
		display: block;
		width: 120px;
		height: 30px;
		margin: 0 auto 10px auto;
		background: none;
		border: 1px solid #786450;
		border-radius: 15px;
		font-size: 12px;
		font-weight: 600;
		box-sizing: border-box;
		-webkit-transition: all .3s ease-in-out;
		transition: all .3s ease-in-out;
		color: #786450;
	}

	.profile .actions .btn:hover {
		background: #786450;
		color: #fff;
	}
</style>
