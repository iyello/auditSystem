// PDFJS.disableStream = true;
var pagetest;
var flag = false;
// PDFJS.disableStream = true;
$("#stamp").attr("disabled", "disabled"); //禁用盖章按钮
$("#view").attr("disabled", "disabled"); //禁用预览按钮
$("#download").attr("disabled", "disabled"); //禁用下载按钮
$("#canvasDiv").hide();
$("#canvasDivz").hide();
var pdfFile;
$('#pdf').change(function () {
    var pdfFileURL = $('#pdf').val();
	// alert(pdfFileURL);
    if (pdfFileURL) {
        $("#imgDiv").empty();//清空上一PDF文件展示图
        $("#imgDiv1").empty();
        $("#canvasDiv").empty();
		$('#canvasDivz').empty();
		$('#sealDiv').empty();
		
		$("#imgDiv").show();
		$("#imgDiv1").show();
		$("#canvasDivz").hide();
        var files = $('#pdf').prop('files'); //获取到文件
        var fileSize = files[0].size;
        var mb;
        if (fileSize) {
            mb = fileSize / 1048576;
            // if (mb > 10) {
            //     alert("文件大小不能>10M");
            //     return;
            // }
        }

        $("#stamp").removeAttr("disabled", "disabled");
        $("#pdfName").text(files[0].name).attr("title", files[0].name);
        $("#sizeText").text(mb.toFixed(2) + "Mb");

        /*pdf.js无法直接打开本地文件,所以利用FileReader转换*/
        var reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onload = function (e) {
            var myData = new Uint8Array(e.target.result)
            var docInitParams = {
                data: myData
            };
            var typedarray = new Uint8Array(this.result);
            PDFJS.getDocument(typedarray).then(function (pdf) { //PDF转换为canvas
                $("#imgDiv").css("border", "0"); //清除文本、边框
                $("#imgDiv1").css("border", "0");
                $("#imgDiv2").css("border", "0");
                if (pdf) {
                    var pageNum = pdf.numPages;
                    pagetest = pageNum;
                    $("#pagesText").text(pageNum);

                    for (var i = 1; i <= pageNum; i++) {
                        var canvas = document.createElement('canvas');
                        canvas.id = "pageNum" + i;
                        $("#imgDiv").append(canvas);
                        var context = canvas.getContext('2d');
                        openPage(pdf, i, context);

                    }
                }
            });
        };
    }
});

function openPage(pdfFile, pageNumber, context) {
    var scale = 2;
    pdfFile.getPage(pageNumber).then(function (page) {
        var img = document.createElement("img");
        viewport = page.getViewport(scale); // reference canvas via context
        var canvas = context.canvas;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
    return;
};

function convertCanvasToImage(canvas) {
    //新Image对象，可以理解为DOM
    var image = new Image();
    // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
    // 指定格式PNG
    image.src = canvas.toDataURL("image/png");
    return image;
}

//dataURL转成Blob
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });

}

// 印章
function createSeal() {
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
    create5star(context, width, height, 20, "#f00", 0);

    // 绘制印章名称     
    // context.font = '8px 宋体';
    context.textBaseline = 'middle';//设置文本的垂直对齐方式  
    context.textAlign = 'center'; //设置文本的水平对对齐方式  
    context.lineWidth = 1.2;
    context.strokeStyle = '#f00';
    // context.strokeText(text, width, height + 40);

    // 绘制印章单位     
    context.translate(width, height);// 平移到此位置,  
    context.font = '22px 宋体'
    var count = text1.length;// 字数     
    var angle = 4 * Math.PI / (3 * (count - 1));// 字间角度     
    var chars = text1.split("");
    var c;
    for (var i = 0; i < count; i++) {
        c = chars[i];// 需要绘制的字符     
        if (i == 0) context.rotate(5 * Math.PI / 6);
        else
            context.rotate(angle);//   
        context.save();
        context.translate(50, 0);// 平移到此位置,此时字和x轴垂直     
        context.rotate(Math.PI / 2);// 旋转90度,让字平行于x轴     
        context.strokeText(c, 0, 0);// 此点为字的中心点     
        context.restore();
    }
}

//绘制五角星    
/**  
* 创建一个五角星形状. 该五角星的中心坐标为(sx,sy),中心到顶点的距离为radius,rotate=0时一个顶点在对称轴上  
* rotate:绕对称轴旋转rotate弧度  
*/
function create5star(context, sx, sy, radius, color, rotato) {
    context.save();
    context.fillStyle = color;
    context.translate(sx, sy);//移动坐标原点    
    context.rotate(Math.PI + rotato);//旋转    
    context.beginPath();//创建路径    
    var x = Math.sin(0);
    var y = Math.cos(0);
    var dig = Math.PI / 5 * 4;
    for (var i = 0; i < 5; i++) {//画五角星的五条边    
        var x = Math.sin(i * dig);
        var y = Math.cos(i * dig);
        context.lineTo(x * radius, y * radius);
    }
    context.closePath();
    context.stroke();
    context.fill();
    context.restore();
}

//变成图片
$("#stamp").click(function () {
	$("#view").removeAttr("disabled", "disabled");
	var div = document.getElementById("canvasDiv");
    $("#canvasDiv").show();
    $("canvas").each(function (index, ele) {
        var canvas = document.getElementById("pageNum" + (pagetest-index));
        var img = convertCanvasToImage(canvas);
        img.id = "img" + (index + 1);
        $('#imgDiv1').append(img);
        var img = document.getElementById(img.id);
        img.onload = function () {

            var man1 = document.getElementById("seal");
            // console.log(img.width);
            var canvas1 = document.createElement('canvas');
            // console.log(canvas);
            canvas1.id = "canvas" + (index + 1);
            canvas1.width = img.width;
            canvas1.height = img.height;
			div.style.width = img.width + "px";
            canvas1.style.width = "100%";
            canvas1.style.height = "100%";
            var ctx = canvas1.getContext("2d");
            ctx.drawImage(img, 0, 0);
            // ctx.globalAlpha = 0.8;			// 设置图片透明度
            // ctx.drawImage(man1, canvas1.width-400, canvas1.height-200);	// 加图片，数字签章
            // 加水印
            // ctx.font = "100px microsoft yahei";
            // ctx.fillStyle = "rgba(255,0,255,1)"; //fillStyle注意和fillText对应
            // ctx.fillText("my images", 100, 100);
            $('#canvasDiv').append(canvas1);
        }
    })
    // var son = document.getElementById("imgDiv");
    // document.body.removeChild(son);
    // son = document.getElementById("imgDiv1");
    // document.body.removeChild(son);
    // $('.frame').hide();
	$("#imgDiv").hide();
	$("#imgDiv1").hide();
	$("#imgDiv").empty();
	$("#imgDiv1").empty();
    $("#sealDiv").hide();
    createSeal();
    flag = true;
    // $("#imgDiv").empty();
});

var canvas = document.getElementById("canvasDiv");
var flag1 = true;
var img1;
canvas.onclick = function (e) {
    if (flag) {
        if (flag1) {
            var canvas = document.getElementById("canvas1");
            var img = convertCanvasToImage(canvas);
            img.id = "img";
            $('#canvasDiv').append(img);
            $("#img").hide();
            var img = document.getElementById(img.id);
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            img1 = img;
            // console.log(img1)
            flag1 = false;
        }
        var x = e.pageX, y = e.pageY;
        // console.log(x, y)
        // alert("1111");
        
        if (!flag1 && y <= img1.height) {
            var man1 = document.getElementById("seal");
            // console.log(img.width);
            var canvas = document.getElementById("canvas1");
            canvas.width = img1.width;
            canvas.height = img1.height;
			// console.log(canvas.width, canvas.height)
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img1, 0, 0);
            ctx.globalAlpha = 0.8;			// 设置图片透明度
            ctx.drawImage(man1, x - 510, y - 80);	// 加图片，数字签章 
        }
    }

}

function view_canvas(j) {
		var canvas = document.getElementById("canvas" + j)
		var img = convertCanvasToImage(canvas);
		img.id = "img" + j;
		$('#imgDiv1').append(img);
		var img = document.getElementById(img.id);
		img.onload = function () {
			var man1 = document.getElementById("seal");
			// console.log(img.width);
			var canvas1 = document.createElement('canvas');
			canvas1.id = "download" + j;
			canvas1.width = img.width;
			canvas1.height = img.height;
			canvas1.style.width = "100%";
			canvas1.style.height = "100%";
			var ctx = canvas1.getContext("2d");
			ctx.drawImage(img, 0, 0);
			$('#canvasDivz').append(canvas1);
		}
}

//预览pdf文件
function view_canvas_main(){
	$("#stamp").attr("disabled", "disabled"); //禁用盖章按钮
	$("#download").removeAttr("disabled", "disabled");
	$("#imgDiv").empty();
	$("#imgDiv1").empty();
	$("#canvasDivz").show();
	$("#canvasDiv").hide();
    var doc = new jsPDF()
    for(i=1;i<=pagetest;i++){
		var j = pagetest-i+1;
		view_canvas(j);
        // var canvas1 = document.getElementById("download" + (pagetest-i+1))
		// console.log(canvas1);
		// console.log(pagetest);
        // var imgData = convertCanvasToImage(canvas)
        // doc.addImage(imgData,'PNG',0,0)
        // if(i<pagetest){
        //     doc.addPage()
        // }    
    }
	$("#canvasDiv").empty();
	$("#imgDiv1").empty();
}

// 下载pdf
function pdfdownload(){
	$("#view").attr("disabled", "disabled"); //禁用预览按钮
	// $("#download").attr("disabled", "disabled"); //禁用下载按钮
    var doc = new jsPDF('p', 'pt', 'a4')
	var pdfWidth = 595;
	// a5 纸大小 [418, 594]
	// a4 纸大小 [595.28, 841.89]
    for(i=1;i<=pagetest;i++){
        var canvas = document.getElementById("download" + (pagetest-i+1))
		// console.log(canvas1);
		// console.log(pagetest);
        var imgData = convertCanvasToImage(canvas)
        doc.addImage(imgData,'PNG',0,50,pdfWidth, pdfWidth / canvas.width * canvas.height)
        if(i<pagetest){
            doc.addPage()
        }    
    }
	
    doc.save('save.pdf');
	location.reload();
	// $("#imgDiv").show();//清空上一PDF文件展示图
	// $("#imgDiv1").show();
    //var doc = new jsPDF();
    // doc.html($('#myCanvas')[0],{
    //     callback:function(){
    //         doc.save()
    //     }
    // })
}