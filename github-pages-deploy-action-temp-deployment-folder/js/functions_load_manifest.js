function getHTML(index, url){
	var html = "<div class=\"col-md-1\">";
	html += "<a href=\"drawing.html?d="+url+"\">";
	html += "<img src=\"img/numbers/"+(index+1)+".png\" class=\"img-responsive\" alt=\"Responsive image\">";
	html += "</a>";
	html += "</div>";
	return html;
}

function generateRows(level, array){
	var rows = Math.ceil(array.length/12);
		
	for(var i=1;i<=rows;i++){
		$("#panel-"+level).append("<div id=\""+level+"-"+i+"\" class=\"row\"></div>")
		if(i != rows){
			$("#panel-"+level).append("<br/>");
		}
	}
}

$( document ).ready(function() {
	// Settings ajax
	$.ajaxSetup({beforeSend: function(xhr){
	 		if (xhr.overrideMimeType){
				xhr.overrideMimeType("application/json");
	  		}
		}
	});

	$.getJSON("drawings/manifest.json", function(result){
		generateRows("easy",result.level.easy);
		generateRows("intermediate",result.level.intermediate);
		generateRows("hard",result.level.hard);
		
		$.each(result.level.easy, function(i, url){
			var row = Math.ceil((i+1)/12);
			$("#easy-"+row).append(getHTML(i, url));
        });
		$.each(result.level.intermediate, function(i, url){
			var row = Math.ceil((i+1)/12);
			$("#intermediate-"+row).append(getHTML(i, url));
        });
		$.each(result.level.hard, function(i, url){
			var row = Math.ceil((i+1)/12);
			$("#hard-"+row).append(getHTML(i, url));
        });
    }).error(function(xhr,status,error){
	    alert(xhr.statusText);
	}); 	
});
