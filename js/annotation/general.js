
/**
* update the tablet selection with the current period filter
*/
function updateSelectOptions() {
  let filterResults = filterSuggestions(
    activeFilter,
    filterCategories,
    urls,
    hs23D,
    periods,
    languages,
    hs2CDLI
  );
  current2DUrls = filterResults[0];
  current3DUrls = filterResults[1];

  /**
    * removes every option from a select element
    */
  function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
  }

  rebuildSelectize();
  var select2D = document.getElementById("images");
  var select3D = document.getElementById("3dimages");
  removeOptions(select2D);
  removeOptions(select3D);
  selectOptions2D="";
  selectOptions3D="";

  for(url in current2DUrls){
    selectOptions2D+="<option value=\""+url+"\">"+url+"</option>"
  }
  select2D.innerHTML=selectOptions2D

  var threedimageindex=0
  threedimageToIndex={}
  for(url in current3DUrls){
    selectOptions3D+="<option value=\""+current3DUrls[url]["url"]+"\">"+url+"</option>"
    threedimageToIndex[url]=threedimageindex;
    threedimageindex+=1;
  }
  document.getElementById("3dimages").innerHTML=selectOptions3D;

  loadVariants();
}

/**
  * init options for the annotation page selects
  */
var selectOptions2D=""
var selectOptions3D=""
var current2DUrls = urls;

for(url in current2DUrls){
  selectOptions2D+="<option value=\""+url+"\">"+url+"</option>"
}
document.getElementById("images").innerHTML=selectOptions2D

/**
  * update the options of the annotation selectize elements
  */
function rebuildSelectize() {
  $('#images').selectize()[0].selectize.destroy();
  $('#3dimages').selectize()[0].selectize.destroy();
  buildSelectize();
  setup3dhop();
}



visible=true
function showHideAnno() {
  visible = negateBool(visible);
  anno.setVisible(visible);
}

approvaltags=[]
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function rescale(X, A, B, C, D){
  console.log("Input: "+X)
  retval = (((X - A).toFixed(2) / (B - A)) * (D - C)) + C
  console.log("Scale factor: "+((B - A) * (D - C)))
  console.log("Rescaled: "+retval)
  return retval
}

var threedimageToIndex={};
var indexedcharids=[]
var indexedhiglighted=false
function formatTranslation(transliteration){
  result=""
  termmap={"@obverse":"front","@reverse":"back","@left":"left","@right":"right","@top":"top","@bottom":"bottom"}
  linecounter=0
  charcounter=0
  currentside=""
  currentcolumn=""
  curterm=""
  for(line of transliteration.split("<br>")){
    if(line.trim().startsWith("@")){
      if(line.trim() in termmap){
        currentside=termmap[line.trim()]
		    curterm=line.trim()
      }else{
        currentside=line.trim()
		    cuterm=currentside
      }
      linecounter=0
      charcounter=0
      result+=line.trim()+"<br/>"
    }else if(line.trim().startsWith("column") || line.trim().startsWith("@column")){
      currentside=currentside.replace(currentcolumn,"")
      currentcolumn=line.trim().replace(" ","_")
      currentside=currentside+"_"+currentcolumn
      currentside=currentside.replace("__","_")
      linecounter=0
      charcounter=0
      result+=line.trim()+"<br/>"
    }else if(line.trim().match(/^\d/)){
      linecounter+=1
      charcounter=0
      newline=line.trim()
      splitted=line.trim().split(" ")
      for(word of splitted){
        word=word.replace("{","-{").replace("}","}-").trim()
        if(word.slice(-1)=="-"){
          word=word.substring(0,word.length-1)
        }
        word=word.replace("--","-")
		lasttranslation=""
        if(word.includes("-")){
          for(char of word.split("-")){
            if(char!=""){
              console.log(curterm)
			  console.log(currentside+"_"+linecounter+"_"+charcounter)
			  if(($("#images option:selected").text() in character_postags) && curterm in character_postags[$("#images option:selected").text()] && currentside+"_"+linecounter+"_"+charcounter in character_postags[$("#images option:selected").text()][curterm]){
				titleobj=character_postags[$("#images option:selected").text()][curterm][currentside+"_"+linecounter+"_"+charcounter]
			  }
              if (typeof titleobj !== 'undefined' && titleobj["translation"]!=lasttranslation){
			  console.log(titleobj)
              result+="<span id=\""+currentside+"_"+linecounter+"_"+charcounter+"\" class=\"imagelink\" title=\""+titleobj["word"]+" "
              if(titleobj["translation"]!="_"){
                result+="["+titleobj["translation"]+"] ("+titleobj["pos"]+")\">"
				if(titleobj["translation"].includes("[") && !titleobj["translation"].includes("[1]")){
					result+=titleobj["translation"].substring(titleobj["translation"].indexOf("[")+1,titleobj["translation"].indexOf("]"))+"</span>"
				}else{
					result+=titleobj["translation"].replace("[1]","")+"</span>"
				}
				lasttranslation=titleobj["translation"]
              }else{
                result+="("+titleobj["pos"]+")\">"
				if(titleobj["translation"].includes("[") && !titleobj["translation"].includes("[1]")){
					result+=titleobj["translation"].substring(titleobj["translation"].indexOf("[")+1,titleobj["translation"].indexOf("]"))+"</span>"
				}else{
					result+=titleobj["translation"].replace("[1]","")+"</span>"
				}
				lasttranslation=titleobj["translation"]
              }
              }else {
                result+="<span id=\""+currentside+"_"+linecounter+"_"+charcounter+"\" class=\"imagelink\">"+char+"</span>"
              }
              if(!char.endsWith("}")){
                result+="&nbsp;"
              }
              charcounter+=1
            }
          }
        }else{
		  if(($("#images option:selected").text() in character_postags) && curterm in character_postags[$("#images option:selected").text()] && currentside+"_"+linecounter+"_"+charcounter in character_postags[$("#images option:selected").text()][curterm]){
			titleobj=character_postags[$("#images option:selected").text()][curterm][currentside+"_"+linecounter+"_"+charcounter]
		  }
		  console.log(character_postags)
		  console.log($("#images option:selected").text())
		  console.log(curterm)
		  console.log(currentside+"_"+linecounter+"_"+charcounter)
      if (typeof titleobj !== 'undefined' && titleobj["translation"]!=lasttranslation){
	  	  console.log(titleobj)
          result+="<span id=\""+currentside+"_"+linecounter+"_"+charcounter+"\" class=\"imagelink\" title=\""+titleobj["word"]+" "
          if(titleobj["translation"]!="_"){
              result+="["+titleobj["translation"]+"] ("+titleobj["pos"]+")\">"+titleobj["translation"]+"</span>&nbsp;"
			  lasttranslation=titleobj["translation"]
          }else {
              result+="("+titleobj["pos"]+")\">"+titleobj["translation"]+"</span>&nbsp;"
			  lasttranslation=titleobj["translation"]
          }
      }else{
        result+="<span id=\""+currentside+"_"+linecounter+"_"+charcounter+"\" class=\"imagelink\">"+word+"</span>&nbsp;"
      }
          charcounter+=1
        }
      }
      result+="<br/>"
    }else{
      result+=line+"<br/>"
    }
  }
  return result
}

function formatTransliteration(transliteration){
  result=""
  termmap={"@obverse":"front","@reverse":"back","@left":"left","@right":"right","@top":"top","@bottom":"bottom"}
  linecounter=0
  charcounter=0
  currentside=""
  currentcolumn=""
  curterm=""
  for(line of transliteration.split("<br>")){
    if(line.trim().startsWith("@")){
      if(line.trim() in termmap){
        currentside=termmap[line.trim()]
		curterm=line.trim()
      }else{
        currentside=line.trim()
		cuterm=currentside
      }
      linecounter=0
      charcounter=0
      result+=line.trim()+"<br/>"
    }else if(line.trim().startsWith("column") || line.trim().startsWith("@column")){
      currentside=currentside.replace(currentcolumn,"")
      currentcolumn=line.trim().replace(" ","_")
      currentside=currentside+"_"+currentcolumn
      currentside=currentside.replace("__","_")
      linecounter=0
      charcounter=0
      result+=line.trim()+"<br/>"
    }else if(line.trim().match(/^\d/)){
      linecounter+=1
      charcounter=0
      newline=line.trim()
      splitted=line.trim().split(" ")
      for(word of splitted){
        if(result.endsWith("-")){
          result=result.substring(0,result.length-1)+"&nbsp;"
        }       
        word=word.replace("{","-{").replace("}","}-").trim()
        if(word.slice(-1)=="-"){
          word=word.substring(0,word.length-1)
        }
        word=word.replace("--","__-")
        if(word.includes("-")){
		      wordsplitted=word.split("-")
		      wordlen=wordsplitted.length
		      wordlencounter=0
          for(char of wordsplitted){
            if(char!=""){
              console.log(curterm)
				      console.log(currentside+"_"+linecounter+"_"+charcounter)
			        if(($("#images option:selected").text() in character_postags) && curterm in character_postags[$("#images option:selected").text()] && currentside+"_"+linecounter+"_"+charcounter in character_postags[$("#images option:selected").text()][curterm]){
			          titleobj=character_postags[$("#images option:selected").text()][curterm][currentside+"_"+linecounter+"_"+charcounter]
			        }
              if (typeof titleobj !== 'undefined'){
			  				console.log(titleobj)
              result+="<span id=\""+currentside+"_"+linecounter+"_"+charcounter+"\" class=\"imagelink\" title=\""+titleobj["word"]+" "
              if(titleobj["translation"]!="_"){
                result+="["+titleobj["translation"]+"] ("+titleobj["pos"]+")\">"+char+"</span>"
              }else{
                result+="("+titleobj["pos"]+")\">"+char+"</span>"
              }
              }else{
                result+="<span id=\""+currentside+"_"+linecounter+"_"+charcounter+"\" class=\"imagelink\">"+char+"</span>"
              }
              charcounter+=1
			        wordlencounter+=1
              console.log(word+" - "+wordsplitted[wordlencounter])
              if(wordlencounter>=wordlen || typeof(wordsplitted[wordlencounter])=="undefined"){
                result+="&nbsp;"
              }else if(wordlencounter<wordlen && char.endsWith("__")){
                result+="-"
              }else if(wordlencounter<wordlen && char.slice(-1)!="}" && wordsplitted[wordlencounter].charAt(0)!="{"){
				        result+="-"
			        }
            }
          }
        }else{
		  if(($("#images option:selected").text() in character_postags) && curterm in character_postags[$("#images option:selected").text()] && currentside+"_"+linecounter+"_"+charcounter in character_postags[$("#images option:selected").text()][curterm]){
			    titleobj=character_postags[$("#images option:selected").text()][curterm][currentside+"_"+linecounter+"_"+charcounter]
		  }	  
      console.log(character_postags)
      console.log($("#images option:selected").text())
      console.log(curterm)
      console.log(currentside+"_"+linecounter+"_"+charcounter)
      if (typeof titleobj !== 'undefined'){
	      console.log(titleobj)
          result+="<span id=\""+currentside+"_"+linecounter+"_"+charcounter+"\" class=\"imagelink\" title=\""+titleobj["word"]+" "
          if(titleobj["translation"]!="_"){
              result+="["+titleobj["translation"]+"] ("+titleobj["pos"]+")\">"+word+"</span>&nbsp;"
          }else{
              result+="("+titleobj["pos"]+")\">"+word+"</span>&nbsp;"
          }
      }else{
        result+="<span id=\""+currentside+"_"+linecounter+"_"+charcounter+"\" class=\"imagelink\">"+word+"</span>&nbsp;"
      }
          charcounter+=1
        }
      }
      result+="<br/>"
    }else{
      result+=line+"<br/>"
    }
  }
  result=result.replaceAll("-<br/>","<br/>")
  result=result.replaceAll("__","").replaceAll("__","")
  return result
}

  function manageApprovals(){
    tabletnumber=$('#images option:selected').text()
    side=$('#imageside option:selected').text().replace(".png","").replace(tabletnumber+"_","")
    if(!(tabletnumber in approvals)){
      approvals[tabletnumber]={}
    }
    if(!(side in approvals[tabletnumber])){
      approvals[tabletnumber][side]={}
    }
    if("tags" in approvals[tabletnumber][side]){
      approvaltags=approvals[tabletnumber][side]["tags"]
      taghtml=""
      for(tag in approvaltags){
        taghtml+="<span style=\"background-color:yellow;color:black;border-radius: 25px;border:1px solid black \">"+approvaltags[tag]+"</span>"
      }
      $('#mytags').html(taghtml)
    }
    if("positioningcorrect" in approvals[tabletnumber][side]){
      $('#positioningcorrect').val(approvals[tabletnumber][side]["positioningcorrect"]).change();
    }
    if("transliterationcorrect" in approvals[tabletnumber][side]){
      $('#transliterationcorrect').val(approvals[tabletnumber][side]["transliterationcorrect"]).change();
    }
    if("indexingcorrect" in approvals[tabletnumber][side]){
      $('#indexingcorrect').val(approvals[tabletnumber][side]["indexingcorrect"]).change();
    }
    if("annotationscorrect" in approvals[tabletnumber][side]){
      $('#annotationscorrect').val(approvals[tabletnumber][side]["annotationscorrect"]).change();
    }
    if("annotationscomplete" in approvals[tabletnumber][side]){
      $('#annotationscomplete').val(approvals[tabletnumber][side]["annotationscomplete"]).change();
    }
  }

  async function saveApprovals(){
    tabletnumber=$('#images option:selected').text()
    side=$('#imageside option:selected').text().replace(".png","").replace(tabletnumber+"_","")
    if(!(tabletnumber in approvals)){
      approvals[tabletnumber]={}
    }
    if(!(side in approvals[tabletnumber])){
      approvals[tabletnumber][side]={}
    }
    approvals[tabletnumber][side]["tags"]=$('#tags').val()
    approvals[tabletnumber][side]["positioningcorrect"]=$('#positioningcorrect').val()
    approvals[tabletnumber][side]["transliterationcorrect"]=$('#transliterationcorrect').val()
    approvals[tabletnumber][side]["indexingcorrect"]=$('#indexingcorrect').val()
    approvals[tabletnumber][side]["annotationscorrect"]=$('#annotationscorrect').val()
    approvals[tabletnumber][side]["annotationscomplete"]=$('#annotationscomplete').val()
    var users= await api.RepositoryFiles.edit(16599, "js/approvals.js","master","var approvals="+JSON.stringify(approvals,null,2),"Committed approvals for "+$('#imageside option:selected').text()+".json");
  }


  function loadVariants(){
    console.log("TEST");
    console.log($('#images option:selected').text())
    console.log(transliterations)
    toappend=""
    if($('#images option:selected').text() in periods){
      toappend+=periods[$('#images option:selected').text()]+" "//$('#period').html(periods[$('#images option:selected').text()])
    }
    if($('#images option:selected').text() in languages){
      toappend+=languages[$('#images option:selected').text()]["language"]+" "+languages[$('#images option:selected').text()]["genre"]
	  if(languages[$('#images option:selected').text()]["subgenre"]!=""){
		toappend+="<br/>"+languages[$('#images option:selected').text()]["subgenre"]
	  }
	  if(languages[$('#images option:selected').text()]["provenience"]!=""){
		toappend+="<br/>Provenience: "+languages[$('#images option:selected').text()]["provenience"]	  
	  }
    }
    if($('#images option:selected').text() in transliterations){
          console.log(transliterations[$('#images option:selected').text()])
      if(transliterations[$('#images option:selected').text()]=="" || transliterations[$('#images option:selected').text()]=="@Tablet"){
		$('#transliterationtextarea').html("No transliteration available for text "+$('#images option:selected').text())
        if($('#images option:selected').text() in hs2CDLI){
          $('#textid').html(""+$('#images option:selected').text()+" - <a target=\"_blank\" href=\"https://cdli.ucla.edu/search/search_results.php?SearchMode=Text&ObjectID="+hs2CDLI[$('#images option:selected').text()]+"\">"+hs2CDLI[$('#images option:selected').text()]+"</a>")
          $('#cdlilink').html("<a target=\"_blank\" href=\"https://cdli.ucla.edu/search/search_results.php?SearchMode=Text&ObjectID="+hs2CDLI[$('#images option:selected').text()]+"\">"+hs2CDLI[$('#images option:selected').text()]+"</a>")
        }else{
          $('#textid').html(""+$('#images option:selected').text()+"")
        }
      }else{
        if($('#images option:selected').text() in hs2CDLI){
          $('#textid').html(""+$('#images option:selected').text()+" - <a target=\"_blank\" href=\"https://cdli.ucla.edu/search/search_results.php?SearchMode=Text&ObjectID="+hs2CDLI[$('#images option:selected').text()]+"\">"+hs2CDLI[$('#images option:selected').text()]+"</a>")
          $('#cdlilink').html("<a target=\"_blank\" href=\"https://cdli.ucla.edu/search/search_results.php?SearchMode=Text&ObjectID="+hs2CDLI[$('#images option:selected').text()]+"\">"+hs2CDLI[$('#images option:selected').text()]+"</a>")
        }else{
          $('#textid').html(""+$('#images option:selected').text()+"")
        }
        $('#transliterationtextarea').html(formatTransliteration(transliterations[$('#images option:selected').text()].replaceAll("\n","<br>")))
		if(!($("#images option:selected").text() in character_postags)){
			$('#translationtextarea').html("No translation available for text "+$('#images option:selected').text())
		}
		$('#translationtextarea').html(formatTranslation(transliterations[$('#images option:selected').text()].replaceAll("\n","<br>")))
  $( function() {
    $( document ).tooltip({
      track: true
    });
  } );
        $('span.imagelink').mouseover(function() {
          console.log("Selecting annotation")
          myid=$(this).attr("id")
          console.log(myid)
          if(myid in curcharindex){
            console.log(curcharindex[myid])
            anno.disableEditor = true
            anno.selectAnnotation(curcharindex[myid])
          }
      });
      $('span.imagelink').mouseout(function() {
          if(translitwasclicked){
            translitwasclicked=false
          }else{
            anno.cancelSelected();
            anno.disableEditor = false
          }      
      });
      $('span.imagelink').click(function() {
          if(anno.disableEditor){
            anno.disableEditor = false
          }else{
            anno.disableEditor = true
          }
      });
      }
    }else{
      $('#textid').html(""+$('#images option:selected').text()+"")
      $('#transliterationtextarea').html("No transliteration available for text "+$('#images option:selected').text())
    }
    imgside=""
    for(obj of urls[$('#images option:selected').text()]["variants"]){
       if(obj["label"].includes("front")){
        imgside+="<option value=\""+obj["url"]+"\" selected=\"selected\">"+obj["label"]+"</option>"
       }else{
        imgside+="<option value=\""+obj["url"]+"\">"+obj["label"]+"</option>"
       }
    }
    $('#imageside').html(imgside)
    $('#period').html(toappend)
    reinit("abc");
  }
  const gitlabtoken="glpat-a4ZiynWzYQBwodR5G5xX"
  const { Gitlab } = gitbeaker;
  const api = new Gitlab({
  token: gitlabtoken, //'9zyFECzKmuhkMo81HKPw',
  host: 'https://gitlab.informatik.uni-halle.de/',
  version: 4
});

function buildSelectize() {
  $(document).ready(function () {
      $('#images').selectize({
          sortField: 'text',
          maxOptions: 5000
      });    
      $('#3dimages').selectize({
          sortField: 'text',
          maxOptions: 5000
      });
  });
}
buildSelectize();



  var curnamespace="http://purl.org/cuneiform/"

	var mappings={"PaleoCode":{"inputtype":"text","regex":"","handler":null,"paleocodage":true,"uri":curnamespace+"PaleoCode"},
	"Transliteration":{"inputtype":"text","regex":"","handler":null,"uri":curnamespace+"Transliteration"},
  "UnicodeCharName":{"inputtype":"select","regex":"","handler":null,"data":charlistmap,"uri":curnamespace+"CharacterName"},
  "Column":{"inputtype":"number","regex":"","handler":null,"uri":curnamespace+"Column"},
	"Line":{"inputtype":"number","regex":"","handler":null,"uri":curnamespace+"Line"},
  "Charindex":{"inputtype":"number","regex":"","handler":null,"uri":curnamespace+"Charindex"},
  "Wordindex":{"inputtype":"number","regex":"","handler":null,"uri":curnamespace+"Wordindex"}
	}

  var readOnlyVar=false

	var TextMapWidget = function(args) {

  var addTag = function(evt) {
    console.log("onKeyUp")
	console.log(evt.srcElement.value)
	console.log(args)
	var removeindex=-1
	for(bod in args.annotation.underlying.body){
		if(args.annotation.underlying.body[bod].purpose==evt.target.id){
			removeindex=bod
		}
	}
  if(removeindex==-1){
	  args.annotation.underlying.body.push({
        type: 'TextualBody',
        purpose: evt.target.id,
        //dimensions: viewer.world.getItemAt(0).getContentSize(), 
        value: evt.srcElement.value
    });
  }else{
    args.annotation.underlying.body[removeindex].value=evt.srcElement.value
    args.annotation.underlying.body[removeindex].dimensions=viewer.world.getItemAt(0).getContentSize()
  }
	console.log(args)
	console.log({
        type: 'TextualBody',
        purpose: evt.target.id,
        //dimensions: viewer.world.getItemAt(0).getContentSize(), 
        value: evt.srcElement.value
    })
  }

  // 4. This part renders the UI elements
  var createTextField = function(key,value) {
    console.log(key+" - "+value)
    var div=document.createElement('table')
    div.style="color:black;background-color:white;border-bottom:1px solid black;"
	div.width="100%"
	var tr=document.createElement('tr')
  tr.style="color:black;background-color:white"
	var td1=document.createElement('td')
  td1.style="color:black;background-color:white"
	var td2=document.createElement('td')
  td2.style="color:black;background-color:white"
	div.appendChild(tr)
	tr.appendChild(td1)
	tr.appendChild(td2)
  var label = document.createElement('label');
  label.style="color:black;background-color:white"
  if(!readOnlyVar){
	  var input = document.createElement('input');
  }else{
    var input = document.createElement('span');
    input.style="color:black;background-color:white"
  }

	console.log(mappings[key])
  if(!readOnlyVar && "inputtype" in mappings[key] && mappings[key]["inputtype"]=="select"){
    input = document.createElement('select');
  }else if(!readOnlyVar && "inputtype" in mappings[key]){
		input.type=mappings[key]["inputtype"]
		input.min=1
	}else if(!readOnlyVar){
		input.type="text"	
	}
  if(!readOnlyVar && "data" in mappings[key] && mappings[key]["inputtype"]=="select"){
    for(keyy in mappings[key]["data"]){
      console.log(keyy)
      option=document.createElement("option")
      option.value=keyy
      option.text=mappings[key]["data"][keyy]["signName"]
      input.appendChild(option)
    }
    for(bod in args.annotation.underlying.body){
		  /*if(args.annotation.underlying.body[bod].purpose==key){
			  input.value=args.annotation.underlying.body[bod].value
		  }*/
	  }
  }else{
    for(bod in args.annotation.underlying.body){
		  if(args.annotation.underlying.body[bod].purpose==key){
        if(!readOnlyVar){
          input.value=args.annotation.underlying.body[bod].value
        }else{
          input.innerHTML=args.annotation.underlying.body[bod].value
        }		  
      }
	  }
    if(!readOnlyVar){
	    input.addEventListener('keyup',addTag)
    }
  }
	input.id=key
	label.innerHTML=key+": "
	td1.appendChild(label)
	td2.appendChild(input)
  if(!readOnlyVar && "paleocodage" in mappings[key]){
    var td3=document.createElement('td')
    tr.appendChild(td3)
    var canvas=document.createElement('canvas')
    td3.appendChild(canvas)
    canvas.id="myCanvas"
    canvas.width=150
    canvas.height=75
    canvas.style="border:1px solid #d3d3d3;"
    input.addEventListener('keyup',function(event){
        paintCharacter(event.target.id)        
        //selectionStart=$('#PaleoCode').prop('selectionStart')
        //selectionEnd=$('#PaleoCode').prop('selectionEnd')
        //strokeParser(document.getElementById('PaleoCode').value)
    });
    input.addEventListener('blur',function(event){
        paintCharacter(event.target.id)        
        //selectionStart=$('#PaleoCode').prop('selectionStart')
        //selectionEnd=$('#PaleoCode').prop('selectionEnd')
        //strokeParser(document.getElementById('PaleoCode').value)
    });
    input.addEventListener("click",function(){
        paintCharacter(event.target.id)
    });
    input.addEventListener("select",function(){
        paintCharacter(event.target.id)
    });
  }
    return div;
  }

  var container = document.createElement('div');
  container.className = 'colorselector-widget';
  for(map in mappings){
    var curval="";
    for(body of args.annotation.bodies){
		if(body.purpose==map){
			curval=body.value
			break;
		}
	}
	var button1 = createTextField(map,curval);	
	container.appendChild(button1);
  }

  return container;
}




async function commitData(){

try{
  var users= await api.RepositoryFiles.create(16599, "result/"+$('#imageside option:selected').text()+".json","master",JSON.stringify(curanno,null,2),"Committed "+$('#imageside option:selected').text()+".json");
}catch (e) {
  var users= await api.RepositoryFiles.edit(16599, "result/"+$('#imageside option:selected').text()+".json","master",JSON.stringify(curanno,null,2),"Committed "+$('#imageside option:selected').text()+".json");
}
console.log(users)
}

async function commit3DBBOX(){
/*try{
  var users= await api.RepositoryFiles.create(16599, "js/hs23D.js","master","var hs23D="+JSON.stringify(hs23D,null,2),"Committed js/hs23D.js");
}catch (e) {*/
  var users= await api.RepositoryFiles.edit(16599, "js/hs23D.js","master","var hs23D="+JSON.stringify(hs23D,null,2),"Committed js/hs23D.js");
//}
//console.log(users)
}

var curnamespace="http://purl.org/cuneiform/"

var mlVocabulary=[{"label":"Broken","uri":curnamespace+"Broken"},{"label":"Character","uri":curnamespace+"Character"},{"label":"Line","uri":curnamespace+"Line"},{"label":"Image","uri":curnamespace+"Image"},{"label":"Word","uri":curnamespace+"Word"},{"label":"Seal","uri":curnamespace+"Seal"},{"label":"Phrase","uri":curnamespace+"Phrase"},{"label":"Erased","uri":curnamespace+"Erased"},{"label":"StrikeOut","uri":curnamespace+"StrikeOut"},{"label":"Wordstart","uri":curnamespace+"Wordstart"},{"label":"Wordend","uri":curnamespace+"Wordend"},{"label":"InWord","uri":curnamespace+"InWord"},{"label":"Wedge","uri":curnamespace+"Wedge"},{"label":"UnknownIfWord","uri":curnamespace+"UnknownIfWord"}]

//var mlVocabulary={"Broken":curnamespace+"Broken","Character":curnamespace+"Character","Line":curnamespace+"Line","Image":curnamespace+"Image","Word":curnamespace+"Word","Seal":curnamespace+"Seal","Phrase":curnamespace+"Phrase","Erased":curnamespace+"Erased","StrikeOut":curnamespace+"StrikeOut","Wordstart":curnamespace+"Wordstart","Wordend":curnamespace+"Wordend","InWord":curnamespace+"InWord","UnknownIfWord":curnamespace+"UnknownIfWord"}



async function getAnnotation(path){
  var users= await api.RepositoryFiles.show(16599, "result/"+$('#imageside option:selected').text()+".json","master");
  console.log(users)
  console.log(atob(users["content"]))
  return JSON.parse(atob(users["content"]))
}

  var index=0;
  var translitwasclicked=false
  var curanno={}
  var curcharindex={}
  var curimgindex={}
  var viewer;
  var anno;
  window.onload = function() {
    viewer = OpenSeadragon({
      id: "openseadragon",
      prefixUrl: "openseadragon/images/",
      degrees: 0,
      showRotationControl: true,
      gestureSettingsTouch: {
        pinchRotate: true
      },
      tileSources: {
        type: "image",
        url: "https://heidicon.ub.uni-heidelberg.de/iiif/2/1127792:592134/full/full/0/default.jpg"
      }
    });

    console.log("MLVOCAB: "+mlVocabulary)

    var annoconfig={
      //formatter: Annotorious.ShapeLabelsFormatter,
      widgets:[
    TextMapWidget,
    'COMMENT',
    { widget: 'TAG', 
    vocabulary: mlVocabulary
    }
    ]}


    // Initialize the Annotorious plugin
    anno = OpenSeadragon.Annotorious(viewer,annoconfig);
    //annotations = OpenSeadragon.Annotations({ viewer });
    Annotorious.SelectorPack(anno);
    //Annotorious.BetterPolygon(anno);
    Annotorious.Toolbar(anno, document.getElementById('my-toolbar-container'));
    $.getJSON("https://gitlab.informatik.uni-halle.de/api/v4/projects/2010/repository/files/result%2F"+encodeURIComponent($('#imageside option:selected').text()+".json")+"/raw?ref=master-local&access_token="+gitlabtoken, function(result){
      console.log(result)
    annotations=[]
    for(ann in result){
      annotations.push(result[ann])
    }
    curanno=result
    //const annotations = result.map(a => new WebAnnotation(a));
    anno.setAnnotations(annotations);
  }).fail(function(jqXHR, textStatus, errorThrown) { anno.setAnnotations([]);})
    // Attach handlers to listen to events
    anno.on('createAnnotation', function(a) {
      console.log(a)
      console.log(JSON.stringify(a))
      curanno[a["id"]]=a
    });
    anno.on('mouseEnterAnnotation', function(annotation, event) {
        console.log(annotation["id"])
        console.log(curimgindex)
        if(annotation["id"] in curimgindex){
          $('#'+curimgindex[annotation["id"]]).css({"backgroundColor": "yellow", "color": "red","border": "2px solid red"})
        }
    });
    anno.on('mouseLeaveAnnotation', function(annotation, event) {
        if(annotation["id"] in curimgindex){
          $('#'+curimgindex[annotation["id"]]).css({"backgroundColor": "#f7f7f9", "color": "#bd4147","border": "0px"})
        }
    });
    anno.on('selectAnnotation', function(annotation) {
        if(annotation["id"] in curimgindex){
          $('#'+curimgindex[annotation["id"]]).css({"backgroundColor": "#f7f7f9", "color": "#bd4147","border": "0px"})
        }
    });
    anno.on('deleteAnnotation', function(a) {
      delete curanno[a["id"]]
    });
    anno.on('updateAnnotation', function(a) {
      curanno[a["id"]]=a
    });
  }

  var indexedchars=0

  function reinit(param){
    param=$('#imageside option:selected').val()
    param2=$('#imageside option:selected').text()

    $('.imagelink').css({"backgroundColor": "#f7f7f9", "color": "#bd4147","border": "0px"})
    /*if(typeof viewer === 'undefined'){
          viewer = OpenSeadragon({
      id: "openseadragon",
      prefixUrl: "openseadragon/images/",
      tileSources: {
        type: "image",
        url: param
      }
    });
        var annoconfig={
      formatter: Annotorious.ShapeLabelsFormatter,
      widgets:[
    TextMapWidget,
    'COMMENT',
    { widget: 'TAG', vocabulary: Object.keys(mlVocabulary) }
    ]}


    // Initialize the Annotorious plugin
    anno = OpenSeadragon.Annotorious(viewer,annoconfig);
    Annotorious.Toolbar(anno, document.getElementById('my-toolbar-container'));
    Annotorious.TiltedBox(anno);
    }else{*/
    viewer.open({
        type: "image",
        url: param
      });
    //}
    manageApprovals()
    curanno={}
    curcharindex={}
    $('#annocomplete').html("Unknown")
    $('#indexingcomplete').html("Unknown")
    $.getJSON("https://gitlab.informatik.uni-halle.de/api/v4/projects/2010/repository/files/result%2F"+encodeURIComponent(param2+".json")+"/raw?ref=master-local&access_token="+gitlabtoken, function(result){
      console.log(result)
          indexedchars=0
          indexedhiglighted=false
          indexedcharids=[]
    annotations=[]
    for(ann in result){
      line=-1
      charindex=-1
      colindex=-1
      for(bod of result[ann]["body"]){
        if("purpose" in bod && bod["purpose"]=="Line"){
          line=bod["value"]
        }else if("purpose" in bod && bod["purpose"]=="Charindex"){
          charindex=bod["value"]
        }else if("purpose" in bod && bod["purpose"]=="Column"){
          colindex=bod["value"]
        }
      }
      if(charindex!=-1 && charindex!="" && line!=-1 && line!=""){
        indexedcharids.push(ann)
        indexedchars+=1
        side=param2.replace(".png","")
        console.log("COLINDEX!!! "+colindex)
        if(colindex!=-1){
          curimgindex[ann]=side.substring(side.lastIndexOf('_')+1)+"_column_"+colindex+"_"+line+"_"+charindex
          curcharindex[side.substring(side.lastIndexOf('_')+1)+"_column_"+colindex+"_"+line+"_"+charindex]=ann
        }else{
          curimgindex[ann]=side.substring(side.lastIndexOf('_')+1)+"_"+line+"_"+charindex
          curcharindex[side.substring(side.lastIndexOf('_')+1)+"_"+line+"_"+charindex]=ann
        }
      }
      annotations.push(result[ann])
    }
    console.log(curcharindex)
    curanno=result
    anno.setAnnotations(annotations);
    if($('#imageside option:selected').text()+".json" in translitcount){
      if(annotations.length>0 && translitcount[$('#imageside option:selected').text()+".json"]>0){
        $('#annocomplete').html((annotations.length/translitcount[$('#imageside option:selected').text()+".json"]*100).toFixed(2)+"% ("+annotations.length+"/"+translitcount[$('#imageside option:selected').text()+".json"]+")") 
        //$('#indexingcomplete').html((translitcount[$('#imageside option:selected').text()+".json"]["indexingcompleteness"]*100).toFixed(2)+"% ("+annotations.length+"/"+translitcount[$('#imageside option:selected').text()+".json"]+")") 
      }else{
        $('#annocomplete').html("0% (0/"+translitcount[$('#imageside option:selected').text()+".json"]+")")
      }
    }else{
      $('#annocomplete').html("Unknown")
    }
    $('#indexingcomplete').html((indexedchars/translitcount[$('#imageside option:selected').text()+".json"]*100).toFixed(2)+"% ("+indexedchars+"/"+translitcount[$('#imageside option:selected').text()+".json"]+")")
  }).fail(function(jqXHR, textStatus, errorThrown) { anno.setAnnotations([]);})

    // Attach handlers to listen to events
    anno.on('createAnnotation', function(a) {
      console.log(a)
      console.log(JSON.stringify(a))
      curanno[a["id"]]=a
    });
    anno.on('deleteAnnotation', function(a) {
      delete curanno[a["id"]]
    });
    anno.on('updateAnnotation', function(a) {
      curanno[a["id"]]=a
    });
  }
  
function sync2D3D(){
	console.log($('#images option:selected').text()+" "+$('#3dimages option:selected').text())
	if($('#images option:selected').text() in threedimageToIndex){
		console.log($('#images option:selected').text()+" - "+threedimageToIndex[$('#images option:selected').text()])
    document.getElementById('3dimages').selectedIndex = threedimageToIndex[$('#images option:selected').text()]
	}
}

function getEXIFData(imageid,targetid){
    var img2 = document.getElementById(imageid);
    console.log("EXIF click")
    EXIF.getData(img2, function() {
        var allMetaData = EXIF.getAllTags(this);
        console.log(allMetaData)
        var allMetaDataSpan = document.getElementById(targetid);
        allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
        var htmltip="<ul>"
        for(tag in allMetaData){
          htmltip+="<li>"+tag+" - "+allMetaData[tag]+"</li>"
        }
        htmltip+="</ul>"
        $( "#metadata" ).tooltip({ content: htmltip });
    });
}

function highlightIndexedChars(){
  console.log(indexedcharids)
  console.log(indexedhiglighted)
  for(indchar of indexedcharids){
    var element=document.querySelector('.a9s-annotation[data-id="'+indchar+'"]').children
    console.log(element)
    if(!indexedhiglighted){
      element[1].classList.add("indexhighlight");     
    }else{
      element[1].classList.remove("indexhighlight");
    }
  }
  indexedhiglighted=!indexedhiglighted
}


function addTag(){
  mytag=$('#comment').val()
  approvaltags.push(mytag)
  if(mytag=="")
    return
  $('#mytags').append("<span style=\"background-color:yellow;color:black;border-radius: 25px;border:1px solid black \">"+mytag+"</span>")
  $('#comment').val("")
}

var presenter = null;

var annos3d={};

function onPickedSpot(id) {
  console.log(id)
  console.log(annos3d)
  if(id in annos3d){
    console.log(annos3d[id])
    content=""
    for(bod in annos3d[id]["body"]){
      content+=annos3d[id]["body"][bod]["value"]+" "
    }
    console.log(content)
    alert(content)
  }
}


function setup3dhop() {
  if($("#3dimages").text() in hs23D && !("bbox" in hs23D[$("#3dimages").text()])){
    	presenter = new Presenter("draw-canvas");
  console.log("load 3d model")
	presenter.setScene({
		meshes: {
			"mesh_1" : { url: $("#3dimages").val() }
		},
		modelInstances : {
			"model_1" : { 
				mesh  : "mesh_1",
				color : [0.8, 0.7, 0.75]
			}
		},
		trackball: {
			type : TurntablePanTrackball,
			trackOptions : {
				startPhi: 35.0,
				startTheta: 15.0,
				startDistance: 2.5,
				minMaxPhi: [-180, 180],
				minMaxTheta: [-30.0, 70.0],
				minMaxDist: [0.5, 3.0]
			}
		}
	});
    console.log(hs23D[$("#3dimages").text()])
    console.log(presenter)
    setTimeout(
    function() 
    {
    hs23D[$("#3dimages").text()]["bbox"]=presenter._scene.meshes.mesh_1.renderable.boundingBox
    console.log(hs23D[$("#3dimages").text()])
    commit3DBBOX()
    }, 20000);

    //
  }
  $.getJSON({    
    url: "https://gitlab.informatik.uni-halle.de/api/v4/projects/2010/repository/files/result%2F"+$("#3dimages").text()+"_03_front.png.json/raw?ref=master-local&access_token="+gitlabtoken,
    success: function(res){
    result=res
      console.log(result)
    annos3d=result
    annotations=[]
    spots={}
    spotcounter=1
    for(ann in result){
      console.log(result[ann])
      if(!("target" in result[ann])){
        continue;
      }
      console.log(ann)
      console.log(hs23D[$("#3dimages").text()]["bbox"])
      spots[""+ann+""]={}
      curspot=spots[""+ann+""]
      curspot["color"]=[0.0, 0.25, 1.0]
      curspot["mesh"]="Cube"
      curspot["transform"]={}
      curspot["transform"]["matrix"]=[]
      spotcounter+=1
      coords=result[ann]["target"]["selector"]["value"].replace('<svg><polygon','').replace('points=\"','').replace("\"></polygon></svg>","").replaceAll(","," ").trim()
      coordarray=coords.split(" ")
      console.log(coordarray)
      res=[]
      for(i=0;i<coordarray.length-1;i+=2){
        res.push([parseFloat(coordarray[i]),parseFloat(coordarray[i+1])])
      }
      console.log(res)
      bbox=turf.bbox(turf.lineToPolygon(turf.lineString(res)))
      console.log(bbox)
      dims=[]
      if("dimensions" in result[ann]["body"][0]){
        dims=result[ann]["body"][0]["dimensions"]
      }else if("dimensions" in result[ann]["target"]){
        dims=result[ann]["target"]["dimensions"]
      }
      if(spotcounter==0){
        curspot["transform"]["matrix"]=SglMat4.mul(SglMat4.translation([-9.087315,24.171282,4.909572]), SglMat4.scaling([0.1, 0.1, 0.07]))
      }else if(dims!=[]){
        console.log("DIMS: "+dims)
        console.log("0 - "+dims["x"]+" - "+hs23D[$("#3dimages").text()]["bbox"]["min"][0]+" - "+hs23D[$("#3dimages").text()]["bbox"]["max"][0])
        console.log("0 - "+dims["y"]+" - "+hs23D[$("#3dimages").text()]["bbox"]["min"][1]+" - "+hs23D[$("#3dimages").text()]["bbox"]["max"][1])
        xcoordre=rescale(bbox[0],0,dims["x"],hs23D[$("#3dimages").text()]["bbox"]["min"][0],hs23D[$("#3dimages").text()]["bbox"]["max"][0])
        ycoordre=rescale(bbox[1],0,dims["y"],hs23D[$("#3dimages").text()]["bbox"]["min"][1],hs23D[$("#3dimages").text()]["bbox"]["max"][1])
        xcoordex=rescale(bbox[3],0,dims["x"],hs23D[$("#3dimages").text()]["bbox"]["min"][0],hs23D[$("#3dimages").text()]["bbox"]["max"][0])
        ycoordex=rescale(bbox[4],0,dims["y"],hs23D[$("#3dimages").text()]["bbox"]["min"][1],hs23D[$("#3dimages").text()]["bbox"]["max"][1])
        xlength=hs23D[$("#3dimages").text()]["bbox"]["max"][0]-hs23D[$("#3dimages").text()]["bbox"]["min"][0]
        ylength=hs23D[$("#3dimages").text()]["bbox"]["max"][1]-hs23D[$("#3dimages").text()]["bbox"]["min"][1]
        zlength=hs23D[$("#3dimages").text()]["bbox"]["max"][2]-hs23D[$("#3dimages").text()]["bbox"]["min"][2]
        xlengthanno=xcoordex-xcoordre
        ylengthanno=ycoordex-ycoordre
        xlengthscale=1-(25/xlengthanno)
        ylengthscale=1-(25/ylengthanno)
        console.log(xlengthscale+" - "+ylengthscale)
        console.log(25/xlengthscale+" - "+25/ylengthscale)
        console.log([xlengthscale,ylength,zlength])
        if(isNaN(xlengthscale) || xlengthscale<=0){
          xlengthscale=0.1
          xcoordre+=xlengthanno/2
        }else{
          
        }
        if(isNaN(ylengthscale) || ylengthscale<=0){
          ylengthscale=0.1
        }else{

        }
        xcoordre+=4

        /*if(xcoordre>=(xlength/2)){
          xcoordre-=(xlength/2)
          xcoordre+=4
        }else{
          xcoordre=hs23D[$("#3dimages").text()]["bbox"]["min"][0]+xcoordre
          xcoordre+=4
        }*/
        ydiff=ylength-ycoordre
        console.log(ydiff)
        ycoordre=ydiff-2
        console.log(xcoordre+" - "+ycoordre)
        //console.log(xcoordre2+" - "+ycoordre2)
        if(xlengthscale!=0.1)
          curspot["transform"]["matrix"]=SglMat4.mul(SglMat4.translation([xcoordre,ycoordre,5.0]),SglMat4.scaling([xlengthscale/25, ylengthscale, 0.07])) 
        else
          curspot["transform"]["matrix"]=SglMat4.mul(SglMat4.translation([xcoordre,ycoordre,5.0]),SglMat4.scaling([xlengthscale, ylengthscale, 0.07]))
        console.log(curspot["transform"]["matrix"])
      }else if("bbox" in hs23D[$("#3dimages").text()]){
        xcoord=bbox[0]/25
        ycoord=bbox[1]/25
        zcoord=bbox[2]/25       
        console.log([xcoord,ycoord,zcoord])
        xlength=hs23D[$("#3dimages").text()]["bbox"]["max"][0]-hs23D[$("#3dimages").text()]["bbox"]["min"][0]
        ylength=hs23D[$("#3dimages").text()]["bbox"]["max"][1]-hs23D[$("#3dimages").text()]["bbox"]["min"][1]
        zlength=hs23D[$("#3dimages").text()]["bbox"]["max"][2]-hs23D[$("#3dimages").text()]["bbox"]["min"][2]
        console.log([xlength,ylength,zlength])
        if(xcoord>=(xlength/2)){
          xcoord-=(xlength/2)
          xcoord+=4
        }else{
          xcoord=hs23D[$("#3dimages").text()]["bbox"]["min"][0]+xcoord
          xcoord+=4
        }
        ydiff=ylength-ycoord
        console.log(ydiff)
        ycoord=ydiff-2
        console.log([xcoord,ycoord,4.9])
        //console.log(SglMat4.mul(SglMat4.translation([xcoord,ycoord,4.9]),SglMat4.scaling([0.1, 0.1, 0.07])))
        curspot["transform"]["matrix"]=SglMat4.mul(SglMat4.translation([xcoord,ycoord,4.9]),SglMat4.scaling([0.1, 0.1, 0.07]))
        console.log(curspot["transform"]["matrix"])
      }else{
        curspot["transform"]["matrix"]=SglMat4.mul(SglMat4.translation([(bbox[0]/25)-10,(bbox[1]/25),4.9]),SglMat4.scaling([0.1, 0.1, 0.07]))
      }
        
      //SglMat4.mul(SglMat4.translation([bbox[0]/10,bbox[1]/10,bbox[2]/10]), SglMat4.scaling([2.0, 2.0, 2.0]))
      console.log(curspot)
      //annotations.push(result[ann])
    }
    console.log(spots)
    	presenter = new Presenter("draw-canvas");
  console.log("load 3d model")
  //presenter._onPickedSpot = onPickedSpot;
	presenter.setScene({
		meshes: {
			"mesh_1" : { url: $("#3dimages").val() },
      "Cube": {url: "models/cube.ply"},
      "Sphere": {url: "models/sphere.ply"}
		},
    spots: spots,
		modelInstances : {
			"model_1" : { 
				mesh  : "mesh_1",
				color : [0.8, 0.7, 0.75]
			}
		},
		trackball: {
			type : TurntablePanTrackball,
			trackOptions : {
				startPhi: 35.0,
				startTheta: 15.0,
				startDistance: 2.5,
				minMaxPhi: [-180, 180],
				minMaxTheta: [-30.0, 70.0],
				minMaxDist: [0.5, 3.0]
			}
		}
	});
console.log("3d model loaded successfully")
//--MEASURE--
	//presenter._onEndMeasurement = onEndMeasure;
//--MEASURE--

//--POINT PICKING--
	//presenter._onEndPickingPoint = onEndPick;

//--POINT PICKING--
console.log("init 3dhop")
  console.log(presenter._scene.meshes)
  },
  error: function(data){
	presenter = new Presenter("draw-canvas");
  console.log("load 3d model")
	presenter.setScene({
		meshes: {
			"mesh_1" : { url: $("#3dimages").val() }
		},
		modelInstances : {
			"model_1" : { 
				mesh  : "mesh_1",
				color : [0.8, 0.7, 0.75]
			}
		},
		trackball: {
			type : TurntablePanTrackball,
			trackOptions : {
				startPhi: 35.0,
				startTheta: 15.0,
				startDistance: 2.5,
				minMaxPhi: [-180, 180],
				minMaxTheta: [-30.0, 70.0],
				minMaxDist: [0.5, 3.0]
			}
		}
	});

console.log("3d model loaded successfully")
//--MEASURE--
	//presenter._onEndMeasurement = onEndMeasure;
//--MEASURE--

//--POINT PICKING--
	//presenter._onEndPickingPoint = onEndPick;
 // presenter._selectionPoints=[[0.0,26.0,2.0]]
  //presenter.repaint()
//--POINT PICKING--
console.log("init 3dhop")
  console.log(presenter._scene.meshes)
  }
  

//--SECTIONS--
//	sectiontoolInit();
//--SECTIONS--
});

}

function actionsToolbar(action) {
	if(action=='home') presenter.resetTrackball();
//--FULLSCREEN--
	else if(action=='full'  || action=='full_on') fullscreenSwitch();
//--FULLSCREEN--
//--ZOOM--
	else if(action=='zoomin') presenter.zoomIn();
	else if(action=='zoomout') presenter.zoomOut();
//--ZOOM--
//--LIGHTING--
	else if(action=='lighting' || action=='lighting_off') { presenter.enableSceneLighting(!presenter.isSceneLightingEnabled()); lightingSwitch(); }
//--LIGHTING--
//--LIGHT--
	else if(action=='light' || action=='light_on') { presenter.enableLightTrackball(!presenter.isLightTrackballEnabled()); lightSwitch(); }
//--LIGHT--
//--CAMERA--
	else if(action=='perspective' || action=='orthographic') { presenter.toggleCameraType(); cameraSwitch(); }
//--CAMERA--
//--COLOR--
	else if(action=='color' || action=='color_on') { presenter.toggleInstanceSolidColor(HOP_ALL, true); colorSwitch(); }
//--COLOR--
//--MEASURE--
	else if(action=='measure' || action=='measure_on') { presenter.enableMeasurementTool(!presenter.isMeasurementToolEnabled()); measureSwitch(); }
//--MEASURE--
//--POINT PICKING--
	else if(action=='pick' || action=='pick_on') { presenter.enablePickpointMode(!presenter.isPickpointModeEnabled()); pickpointSwitch(); }
//--POINT PICKING--
//--SCREENSHOT--
	else if(action=='screenshot') presenter.saveScreenshot();
//--SCREENSHOT--
//--SECTIONS--
	else if(action=='sections' || action=='sections_on') { sectiontoolReset(); sectiontoolSwitch(); }
//--SECTIONS--
}

//--MEASURE--
function onEndMeasure(measure) {
	// measure.toFixed(2) sets the number of decimals when displaying the measure
	// depending on the model measure units, use "mm","m","km" or whatever you have
	$('#measure-output').html(measure.toFixed(2) + "mm"); 
}
//--MEASURE--

alreadypickedpoints=[]

//--PICKPOINT--
function onEndPick(point) {
	// .toFixed(2) sets the number of decimals when displaying the picked point	
	var x = point[0].toFixed(2);
	var y = point[1].toFixed(2);
	var z = point[2].toFixed(2);
    $('#pickpoint-output').html("[ "+x+" , "+y+" , "+z+" ]");
  alreadypickedpoints.push([x,y,z])
  console.log(alreadypickedpoints)
  presenter._selectionPoints=alreadypickedpoints
  presenter.repaint()
} 
//--PICKPOINT--	

function selectionSwitch(on) {
    if (on === undefined) on = presenter.isSelectionToolEnabel();

    if (on) {
        measureSwitch(false)
        //TODO: Deselect all other Tools

        $('#select').css("visibility", "hidden");
        $('#select_on').css("visibility", "visible");
        $('#draw-canvas').css("cursor", "copy");


    } else {
        $('#select').css("visibility", "visible");
        $('#select_on').css("visibility", "hidden");
        $('#draw-canvas').css("cursor", "default");
        test = presenter.isAnyMeasurementEnabled()
        if (!presenter.isAnyMeasurementEnabled()) $('#draw-canvas').css("cursor", "default");

    }

}



$(document).ready(function(){
	init3dhop();
	 var interval, id, ismousedown;
	 var button = 0;
$('#toolbar2 img')
        .mouseenter(function(e) {
            id = $(this).attr('id');
            if (!ismousedown) $(this).css("opacity", "0.8");
            else $(this).css("opacity", "1.0");
        })
        .mouseout(function(e) {
            clearInterval(interval);
            $(this).css("opacity", "0.5");
        })
        .mousedown(function(e) {
            id = $(this).attr('id');
            ismousedown = true;
            if (e.button == button) {
                actionsToolbar(id);
                if (id == "zoomin" || id == "zoomout") {
                    interval = setInterval(function() {
                        actionsToolbar(id);
                    }, 100);
                } else {
                    clearInterval(interval);
                }
                $(this).css("opacity", "1.0");
                button = 0;
            }
        })
        .mouseup(function(e) {
            ismousedown = false;
            if (e.button == button) {
                clearInterval(interval);
                $(this).css("opacity", "0.8");
                button = 0;
            }
        })
        .on('touchstart', function(e) {
            button = 2;
        })
        .on('touchend', function(e) {
            button = 0;
        });
	setup3dhop();

});


/**
 * init options for annotation page 3D select
 */
var current3DUrls = hs23D;
var threedimageindex=0
  for(url in current3DUrls){
    selectOptions3D+="<option value=\""+hs23D[url]["url"]+"\">"+url+"</option>"
    threedimageToIndex[url]=threedimageindex;
    threedimageindex+=1;
  }
  document.getElementById("3dimages").innerHTML=selectOptions3D;


/*
<h3 align="center">Grid Annotation test</h3>
Grid Size: <input id="gridsize" type="number" value="20" onChange="recreateGrid()"/><br/>
Grid Offset X: <input id="gridoffsetx" type="number" value="0" onChange="recreateGrid()"/><br/>
Grid Offset Y: <input id="gridoffsety" type="number" value="0" onChange="recreateGrid()"/><br/>
<div id="grid-source"><img id="gridimage" src="https://heidicon.ub.uni-heidelberg.de/iiif/2/1108001:570701/full/full/0/default.jpg"></div>
<div id="grid-overlay"></div>

function recreateGrid(){
var $src = $('#grid-source');
var $wrap = $('#grid-overlay');
$wrap.html("")
var $gsize = $('#gridsize').val();
var xoffset=$('#gridoffsetx').val()
var yoffset=$('#gridoffsety').val()
var $cols = Math.ceil($src.find('img').innerWidth() / $gsize);
var $rows = Math.ceil($src.find('img').innerHeight() / $gsize);

// create overlay
var $tbl = $('<table style="position:relative; left:'+xoffset+'px; top:'+yoffset+'px;"></table>');
for (var y = 1; y <= $rows; y++) {
    var $tr = $('<tr></tr>');
    for (var x = 1; x <= $cols; x++) {
        var $td = $('<td></td>');
        $td.css('width', $gsize+'px').css('height', $gsize+'px');
        $td.attr("lowx",x*$gsize);
        $td.attr("highx",x*($gsize+1));
        $td.attr("lowy",y*$gsize);
        $td.attr("highy",y*($gsize+1));
        $td.addClass('unselected');
        $tr.append($td);
    }
    $tbl.append($tr);
}
$src.css('width', $cols*$gsize+'px').css('height', $rows*$gsize+'px')
lastlowx=-1000
// attach overlay
$wrap.append($tbl);
//$wrap.html($('#gridimage').html()+$wrap.html());
var mousedown=false
$('#grid-overlay td').hover(function() {
    $(this).toggleClass('hover');
});

$('#grid-overlay td').click(function() {
    $(this).toggleClass('selected').toggleClass('unselected');
});

$('#grid-overlay td').dblclick(function() {
    alert("Double click")
});

$('#grid-overlay td').mousedown(function() {
    mousedown=true
});

$('#grid-overlay td').mouseup(function() {
    mousedown=false
});

$('#grid-overlay td').mousemove(function() {
    if(!mousedown)
      return;
    if(lastlowx!=$(this).attr("lowx")){
      $(this).toggleClass('selected').toggleClass('unselected');
      lastlowx=$(this).attr("lowx")
    }
});
}
recreateGrid();

      paleolist=""
      for(pal in paleocodemap){
        paleolist+="<li>"+pal+"<ul>"
        svgcounter=1
        for(pall in paleocodemap[pal]){
          paleolist+="<li>"+pall+" "
          //<div id=\"svg"+svgcounter+"\">
          paleolist+="<svg width=\"100\" height=\"75\"><path stroke=\"black\" fill=\"black\" d=\""+paleoCodageToSVG(pall,null,"svgcanvas")+"\"/></svg>"
          //</div>
          clearCanvas(true,"svgcanvas")
          paleolist+=" ("+paleocodemap[pal][pall]+")</li>"
          svgcounter+=1
        }
        paleolist+="</ul></li>"
      }
      console.log(paleolist)
      $('#paleocodelist').html(paleolist)
*/