function getFrame(faction,health) {
  let fac = loadImage('assets/'+faction+'Frame'+health+'.png',(loadedFrame)=>{frame=loadedFrame;refresh();});
  skillPlate = loadImage('assets/SkillPlate'+faction+'.png',(loadedPlate)=>{skillPlate=loadedPlate; refresh();})
  return fac;
}

var db;
var w = 672, h = 944;
var boxW=558, boxH=400;
let pg,fullCard, fullCardimg;

function textSkill(card,skillText,sx,sy,mh,mw,skill) {
  let skillText_nl = skillText.replaceAll("\n"," \n ")
  const wordsStr = skillText_nl.split(' ')
  card.textSize(16);
  card.textFont(skillTextFont);
	let x = sx+50
	let y = sy
  let p = 0
  let linectr = 0;
	for (let i = 0; i < wordsStr.length; i++) 
    {
      card.textSize(16);
      card.textFont(skillTextFont);
      card.fill(20)
      var wordStr = wordsStr[i] 
      if(wordStr.includes('**'))
      {
        wordStr = wordStr.replace('**','');
        card.textFont(skillTextFontBold);
        card.fill(0);
      }
      if(wordStr.includes('$$'))
        {
          wordStr = wordStr.replace('$$','');
          card.textFont(skillTextFontBold);
          card.fill(0,133,0);
        }
      if(wordStr.includes('%%'))
        {
          wordStr = wordStr.replace('%%','');
          card.textFont(skillTextFontBold);
          card.fill(234,0,0);
        }
      if(wordStr.includes('@@'))
      {
        wordStr = wordStr.replace('@@','');
        card.textFont(skillTextFontBold);
        card.fill(0,0,243);
      }
      if(wordStr.includes('##'))
        {
          wordStr = wordStr.replace('##','');
          card.textFont(skillTextFontBold);
          card.fill(25,154,160);
        }
      if(wordStr.includes('=='))
        {
          wordStr = wordStr.replace('==','\u{1F846}');
          card.textFont('Arial');
          card.fill(0);
        }
      if(wordStr.includes('&&'))
      {
        if(wordStr.includes('spades'))
        {
          wordStr = wordStr.replace('&&spades','\u2660');
          card.textFont('Arial');
          card.textSize(22);
          card.fill(0);
        }
        else if(wordStr.includes('hearts'))
        {
          wordStr = wordStr.replace('&&hearts','\u2665');
          card.textFont('Arial');
          card.textSize(22);
          card.fill(234,0,0);
          
        }
        else if(wordStr.includes('diamonds'))
        {
          wordStr = wordStr.replace('&&diamonds','\u2666');
          card.textFont('Arial');
          card.textSize(22);
          card.fill(234,0,0);
        }
        else
        {
          wordStr = wordStr.replace('&&clubs','\u2663');
          card.textFont('Arial');
          card.textSize(22);
          card.fill(0);
        }
        
      }
      if(wordStr.includes('\n'))
        {
          linectr++;
          y += 26;
          if(p<1)
          {
            x = sx+50
            p++
          }
          else x = 10;
        }
        if(wordStr.includes('>>'))
        {
          wordStr = wordStr.replace('>>','');
          x=sx+50;
        }
      const wordStrWidth = card.textWidth(wordStr)
      card.text(wordStr, x, y) 

      x = x + wordStrWidth + card.textWidth(' ')
      
      let nextWordStr = wordsStr[i+1] || '';
      const nextWordStrWidth = textWidth(wordsStr[i+1]) || 0
      if ((x > mw - nextWordStrWidth) && (nextWordStr.includes('\n') == false)) 
      {
          linectr++;
          y += 26
          if(p<1) 
          {
            x = sx+50
            p++
          }
          else x = 10
      }
	}
  let offset;
  if(linectr<=1)
  {
    offset=58;
  }
  else
  {
    offset=58;
  }
  //console.log(linectr);
  skill.setStartPos(sy);
  skill.setPos((y+offset));
}

var frame,cardArt,skillPlate,modifyPlate,UnlockPlate;
var artOffsetH,artOffsetVd;
var loadedImages =0;
var skill1,skill2,skill3,skill4,skill5,skill6;
var skillArr;
var chName, art,hp,faction, b64Img;

class Skill 
{
  constructor(title,text,position,startPos)
  {
    this.title = title
    this.text = text
    this.pos = position
    this.startPos = startPos;
    this.filled = 0;
  }
  setTitle(title){this.title = title; 
    if(title != '')this.filled = 1;
    if(this.text == '' && title == '')this.filled = 0;
  }
  setText(text){this.text = text;
    if(text != '')this.filled = 1;
    if(this.title == '' && text == '')this.filled = 0;
  }
  setPos(pos){this.pos = pos;}
  setStartPos(pos){this.startPos = pos;}
}

function preload()
{
  skillTextFontBold = loadFont('assets/quadrat-serial-medium.ttf')
  skillTextFont = loadFont('assets/Quadrat-Serial Regular.ttf')
  skillTitleFont = loadFont('assets/Impuls BT.ttf')
  nameFont = loadFont('assets/Mistral Regular.ttf')
  modifyPlate = loadImage('assets/ModifyPlate.png')
  UnlockPlate = loadImage('assets/UnlockPlate.png')
  defaultImage = loadImage('assets/Dummy.png')
}

var in_faction,in_chname, in_hp, in_art, savebtn,
art_uncropped, plateArr,
in_skill1,in_skill1name, in_plate1,
in_skill2,in_skill2name, in_plate2,
in_skill3,in_skill3name, in_plate3,
in_skill4,in_skill4name, in_plate4,
in_skill5,in_skill5name, in_plate5,
in_skill6,in_skill6name, in_plate6,
artPosX =0,artPosY= 0,sizeOffs = 0;

var allData;
function textBox(name,id,posX,posY,BW,BH)
{
  if(name != 'noLabel')
  {
    let label = createElement('label')
    label.id(id+'_label');
    document.getElementById(id+'_label').innerHTML = name;
    label.style('position','absolute');
    label.style('left',posX+'px');
    label.style('top',(posY-25)+'px');
  }
  let ref = createElement('textarea')
  ref.id(id)
  ref.style('position','absolute');
  ref.style('left',posX+'px');
  ref.style('top',posY+'px');
  ref.style('width',BW+'px');
  ref.style('height',BH+'px');
  ref.style('word-wrap','break-word');
  ref.style('white-space','pre-wrap');
  ref.style('resize','none');
  return ref;
}
function dropDown(id,posX,posY,BW,BH,type)
{
  let label = createElement('label')
  label.id(id+'_label');
  document.getElementById(id+'_label').innerHTML = type;
  label.style('position','absolute');
  label.style('left',posX+'px');
  label.style('top',(posY-25)+'px');
  let ref;
  if(type == 'Faction')
  {
    ref = createElement('select',
      ['<option value=\"Qun\">Qun</option>',
       '<option value=\"Shu\">Shu</option>',
       '<option value=\"Wei\">Wei</option>',
       '<option value=\"Wu\">Wu</option>',
       '<option value=\"AB\">Applebread</option>'
      ]);
  }
  else if(type == 'Health')
    {
      ref = createElement('select',
        ['<option value=\"3\">3 HP</option>',
         '<option value=\"4\">4 HP</option>',
         '<option value=\"5\">5 HP</option>',
        ]);
    }
    else
    {
      ref = createElement('select',
        ['<option value=\"Normal\">Normal</option>',
         '<option value=\"Modify\">Modify</option>',
         '<option value=\"Unlock\">Enforced</option>',
        ]);
    }
  ref.id(id);
  ref.style('position','absolute');
  ref.style('left',posX+'px');
  ref.style('top',posY+'px');
  ref.style('width',BW+'px');
  ref.style('height',BH+'px');
  return ref;
}

function setup() {
  createCanvas(1344, h);
  fullCard = createGraphics(w,h);
  skill1 = new Skill(),skill2 = new Skill(),
  skill3 = new Skill(),skill4 = new Skill();
  skill5 = new Skill(),skill6 = new Skill();
  skillArr = [skill1,skill2,skill3,skill4,skill5,skill6];
  in_skill1 = textBox('noLabel','input1',50,400,200,100)
  in_skill1name = textBox('noLabel','input1Label',125,364,125,25)
  in_plate1 = dropDown('type1',50,364,70,32,'Skill 1')
  in_skill2 = textBox('noLabel','input2',270,400,200,100)
  in_skill2name = textBox('noLabel','input2Label',345,364,125,25)
  in_plate2 = dropDown('type2',270,364,70,32,'Skill 2')
  in_skill3 = textBox('nolabel','input3',50,600,200,100)
  in_skill3name = textBox('noLabel','input3Label',125,564,125,25)
  in_plate3 = dropDown('type3',50,564,70,32,'Skill 3')
  in_skill4 = textBox('noLabel','input4',270,600,200,100)
  in_skill4name = textBox('noLabel','input4Label',345,564,125,25)
  in_plate4 = dropDown('type4',270,564,70,32,'Skill 4')
  in_skill5 = textBox('nolabel','input5',50,800,200,100)
  in_skill5name = textBox('noLabel','input5Label',125,764,125,25)
  in_plate5 = dropDown('type5',50,764,70,32,'Skill 5')
  in_skill6 = textBox('noLabel','input6',270,800,200,100)
  in_skill6name = textBox('noLabel','input6Label',345,764,125,25)
  in_plate6 = dropDown('type6',270,764,70,32,'Skill 6')
  in_chname = textBox('Character Name',"charNameInput",50,150,300,40)
  plateArr = [in_plate1,in_plate2,in_plate3,in_plate4,in_plate5,in_plate6];
  in_art = createFileInput(handleImage)
  let filelabel = createElement('fileLabel')
  filelabel.id('file_label');
  document.getElementById('file_label').innerHTML = 'Character Art';
  filelabel.style('position','absolute');
  filelabel.style('left','50px');
  filelabel.style('top','210px');
  in_art.position(50,230);
  in_faction = dropDown('fac',50,50,150,50,'Faction')
  in_hp = dropDown('hp',210,50,150,50,'Health')
  in_faction.changed(updateImages);
  in_art.changed(updateImages);
  in_hp.changed(updateImages);
  savebtn = createButton('save card');
  savebtn.style('font-size','')
  savebtn.style('width','150px');
  savebtn.style('height','50px');
  savebtn.mousePressed(saveCard);
  savebtn.position(460,50);
  loadbtn = createButton('load card');
  loadbtn.style('font-size','')
  loadbtn.style('width','150px');
  loadbtn.style('height','50px');
  loadbtn.mousePressed(loadCard);
  loadbtn.position(460,100);
  downloadbtn = createButton('download card');
  downloadbtn.style('font-size','')
  downloadbtn.style('width','150px');
  downloadbtn.style('height','50px');
  downloadbtn.mousePressed(downloadCard);
  downloadbtn.position(460,150);

  frame = getFrame(in_faction.value(),in_hp.value());
  skillPlate = loadImage('assets/SkillPlateQun.png',(loadedPlate)=>{skillPlate=loadedPlate; refresh();})
  art_uncropped = defaultImage;
  b64Img = 0;
  
  let request = window.indexedDB.open("savedCards");

  request.onerror = event => {
    console.error("Database error: " + event.target.errorCode);
  };
  request.onsuccess = event => {
    db = event.target.result;
  };
  request.onupgradeneeded = function(event) {
      db = event.target.result;
      const objectStore = db.createObjectStore("formData", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("lookupId", "lookupId", { unique: true, autoIncrement: true });
      objectStore.createIndex("characterName", "characterName", { unique: false });
      objectStore.createIndex("faction", "faction", { unique: false });
      objectStore.createIndex("hp", "hp", { unique: false });
      objectStore.createIndex("cardArt", "cardArt", { unique: false });
      objectStore.createIndex("thumbnail", "thumbnail", { unique: false });
      objectStore.createIndex("skill1Title", "skill1Title", { unique: false });
      objectStore.createIndex("skill1Text", "skill1Text", { unique: false });
      objectStore.createIndex("skill1Type", "skill1Type", { unique: false });
      objectStore.createIndex("skill2Title", "skill2Title", { unique: false });
      objectStore.createIndex("skill2Text", "skill2Text", { unique: false });
      objectStore.createIndex("skill2Type", "skill2Type", { unique: false });
      objectStore.createIndex("skill3Title", "skill3Title", { unique: false });
      objectStore.createIndex("skill3Text", "skill3Text", { unique: false });
      objectStore.createIndex("skill3Type", "skill3Type", { unique: false });
      objectStore.createIndex("skill4Title", "skill4Title", { unique: false });
      objectStore.createIndex("skill4Text", "skill4Text", { unique: false });
      objectStore.createIndex("skill4Type", "skill4Type", { unique: false });
      objectStore.createIndex("skill5Title", "skill5Title", { unique: false });
      objectStore.createIndex("skill5Text", "skill5Text", { unique: false });
      objectStore.createIndex("skill5Type", "skill5Type", { unique: false });
      objectStore.createIndex("skill6Title", "skill6Title", { unique: false });
      objectStore.createIndex("skill6Text", "skill6Text", { unique: false });
      objectStore.createIndex("skill6Type", "skill6Type", { unique: false });
      objectStore.createIndex("artPosX", "artPosX", { unique: false });
      objectStore.createIndex("artPosY", "artPosY", { unique: false });
      objectStore.createIndex("sizeOffs", "sizeOffs", { unique: false });
  };

}

function saveCard()
{
  let facs = in_faction.value()
  let hps = in_hp.value()
  let thumbnail = fullCard.elt.toDataURL('image/png'); 
  let t1 = in_plate1.value(),t2 = in_plate2.value(),t3 = in_plate3.value(),
      t4 = in_plate4.value(),t5 = in_plate5.value(),t6 = in_plate6.value();
  console.log(t1);
  const formData = {
      characterName: in_chname.value(),
      faction: facs,
      hp: hps,
      cardArt: b64Img,
      thumbnail: thumbnail,
      skill1Title: in_skill1name.value(),
      skill1Text: in_skill1.value(),
      skill1Type: t1,
      skill2Title: in_skill2name.value(),
      skill2Text: in_skill2.value(),
      skill2Type: t2,
      skill3Title: in_skill3name.value(),
      skill3Text: in_skill3.value(),
      skill3Type: t3,
      skill4Title: in_skill4name.value(),
      skill4Text: in_skill4.value(),
      skill4Type: t4,
      skill5Title: in_skill5name.value(),
      skill5Text: in_skill5.value(),
      skill5Type: t5,
      skill6Title: in_skill6name.value(),
      skill6Text: in_skill6.value(),
      skill6Type: t6,
      artPosX: artPosX,
      artPosY: artPosY,
      sizeOffs: sizeOffs
    };

    const transaction = db.transaction("formData", "readwrite");
    const objectStore = transaction.objectStore("formData");
    const index = objectStore.index("characterName");

    const getReq = index.get(formData.characterName);
    getReq.onsuccess = function(event)
    {
      const existing = event.target.result;
      if(existing)
      {
        formData.id = existing.id
      }
      const addReq = objectStore.put(formData);
      addReq.onsuccess = function()
      {
        alert("card saved succesfully!");
      }
    }   
}
let deletedFlag = false;
function loadCard()
{
    const transaction = db.transaction(["formData"], "readonly");
    const objectStore = transaction.objectStore("formData");

    const loadReq = objectStore.getAll();  // Fetch all records
    
    loadReq.onsuccess = function(event) {
    allData = event.target.result;
    const saveList = document.getElementById("savedList");
    saveList.innerHTML = ''; // Clear previous list
    allData.forEach(save => {
      const item = document.createElement("img");
      item.src = save.thumbnail;
      item.width = 100;
      item.textContent = `${save.characterName}`;
      item.classList.add("save-option");
      item.onclick = () => {
        console.log(save.id);
        loadSave(save.id);
        var loadBox = document.getElementById("loadBox");
        loadBox.style.display = "none";
      };
      const label = document.createElement("label")
      label.textContent = `${save.characterName}`;
      label.classList.add("label")
      const delBtn = document.createElement("img")
      delBtn.src = "assets/trashIcon.png";
      delBtn.classList.add("delBtn");
      delBtn.onclick = () => {
        deleteCard(save.id);
      }
      delBtn.width=30;
      saveList.appendChild(item);
      saveList.appendChild(delBtn);
    });

    document.getElementById("loadBox").style.display = "block";
    }; 
    
}
function deleteCard(id)
{
  const transaction = db.transaction("formData", "readwrite");
    const objectStore = transaction.objectStore("formData");
    const delReq = objectStore.delete(id);
    delReq.onsuccess = function() {
      document.getElementById("loadBox").style.display = "none";
      deletedFlag = true;
      loadCard();
    };
}
function loadSave(id) {
  let selected = allData.find(o => o.id === id);
  console.log(selected);
  in_chname.value(selected.characterName);
  in_faction.value(selected.faction);
  in_hp.value(selected.hp);
  frame = getFrame(in_faction.value(),in_hp.value());
  in_skill1.value(selected.skill1Text);
  in_skill1name.value(selected.skill1Title);
  in_plate1.value(selected.skill1Type);
  in_skill2.value(selected.skill2Text);
  in_skill2name.value(selected.skill2Title);
  in_plate2.value(selected.skill2Type);
  in_skill3.value(selected.skill3Text);
  in_skill3name.value(selected.skill3Title);
  in_plate3.value(selected.skill3Type);
  in_skill4.value(selected.skill4Text);
  in_skill4name.value(selected.skill4Title);
  in_plate4.value(selected.skill4Type);
  in_skill5.value(selected.skill5Text);
  in_skill5name.value(selected.skill5Title);
  in_plate5.value(selected.skill5Type);
  in_skill6.value(selected.skill6Text);
  in_skill6name.value(selected.skill6Title);
  in_plate6.value(selected.skill6Type);
  artPosX = selected.artPosX;
  artPosY = selected.artPosY;
  sizeOffs = selected.sizeOffs;
  if(selected.cardArt < 10)
  {
    art_uncropped = defaultImage;
  }
  else
  {
    //console.log(typeof selected.cardArt, selected.cardArt.slice(0, 30));
    art_uncropped = loadImage(selected.cardArt,(loadedimage) => {loadedimage.resize(672,0);art_uncropped = loadedimage;console.log("loaded");refresh();});
  }
}
function downloadCard()
{
  save(fullCard,'Card_'+chName+'.png')
}
function handleImage(file)
{
  
  if(file.type === 'image')
  {
    
    loadImage(file.data,(loadedImage)=>
      {
        loadedImage.resize(672,0);
        art_uncropped=loadedImage;
        let saveImg = createGraphics(art_uncropped.width, art_uncropped.height);
        saveImg.image(loadedImage, 0, 0);
        b64Img = saveImg.elt.toDataURL('image/png'); 
        //art_uncropped.resize(0,910);
        refresh();
      })
  }
}
function updateImages()
{
  frame = getFrame(in_faction.value(),in_hp.value());
  //loadImage(in_art.value(),(loadedImage)=>{cardArt=loadedImage; refresh();})
}

let lastArtUpdate = -1;
async function saveImage() {
  if(art_uncropped != lastArtUpdate)
  {
    let saveImg = createGraphics(art_uncropped.width, art_uncropped.height);
    saveImg.image(art_uncropped.get(), 0, 0);
    b64Img = saveImg.elt.toDataURL('image/png'); 
    lastArtUpdate = art_uncropped;
  }  
}

function refresh()
{
  fullCard.clear();
  let temp = createGraphics(fullCard.width,fullCard.height);
  background('aqua');
  let posx = 672, posy=944;
  let textX = 90;
  let textPos = 0, namepos = 550;

  chName = in_chname.value();
  skill1.setTitle(in_skill1name.value());
  skill1.setText(in_skill1.value());
  skill2.setTitle(in_skill2name.value());
  skill2.setText(in_skill2.value());
  skill3.setTitle(in_skill3name.value());
  skill3.setText(in_skill3.value())
  skill4.setTitle(in_skill4name.value());
  skill4.setText(in_skill4.value());
  skill5.setTitle(in_skill5name.value());
  skill5.setText(in_skill5.value());
  skill6.setTitle(in_skill6name.value());
  skill6.setText(in_skill6.value());
  //resize card art and add it
  let tempImg = createGraphics(temp.width,temp.height);
  tempImg.fill(255);
  tempImg.rect(15,15,630,910);
  cardArt = art_uncropped.get();
  cardArt.resize(cardArt.width+sizeOffs,0);
  let sw = cardArt.width;
  let sh = cardArt.height;
  if(artPosX == 0)
  {
    artPosX = 25 + sw/2;
    artPosY = 20 + sh/2;
  }
  
  tempImg.image(cardArt,(artPosX-(sw/2)),(artPosY-(sh/2)));
  let img = tempImg.get(25,20,627,910);
  temp.image(img,25,20);
  //create skill text boxes
  pg = createGraphics(boxW, h);
  pg.background(235,219,228,220);
  for(let t=0;t<skillArr.length;t++)
  {
    if(skillArr[t].filled != 0)
    {
      textSkill(pg,skillArr[t].text,65,textPos+19,h,boxW-67,skillArr[t]);
      textPos = skillArr[t].pos-42;
    }
  }
  textPos+=42
  if(textPos>400)
  {
    namepos += 100+(textPos-480)
  }
  //add text to text box and add it to card
  temp.image(pg,textX,h-textPos);
  //add card frame
  temp.image(frame,0,0,posx,posy);
  //add skill plates & title
  let ttoffs = 0;
  for(let t=0;t<skillArr.length;t++)
    {
      if(skillArr[t].filled != 0)
      {
        let plt;
        if(plateArr[t].value() == 'Modify')
        {
          plt = modifyPlate;
          ttoffs = -38
        }
        else if(plateArr[t].value() == 'Unlock')
        {
          plt = UnlockPlate;
          ttoffs = -38;
        }
        else plt = skillPlate;
        plt.resize(160,0);
        temp.image(plt,textX-50,h-(textPos-skillArr[t].startPos+18));
        temp.textFont(skillTitleFont);
        temp.textSize(30);
        temp.fill(255);
        temp.stroke(0);
        temp.strokeWeight(5);
        if(ttoffs != 0)
          {
            temp.textAlign(LEFT);
          }
          else temp.textAlign(CENTER);
        temp.textLeading(24);
        let offset=0;
        if(plateArr[t].value() == 'Modify' || 
           plateArr[t].value() == 'Unlock')
        {
          offset =-3
        }
        if(skillArr[t].title.includes("\n")){offset = 12;}
        temp.text(skillArr[t].title,textX+28+ttoffs,h-(textPos-skillArr[t].startPos)+14-offset);
      }
      
    }
  
  
  temp.textFont(nameFont);
  temp.textSize(70);
  temp.fill(255);
  temp.stroke(0);
  temp.strokeWeight(10);
  temp.textAlign(CENTER);
  temp.textLeading(65);
  temp.text(chName,textX,h-(namepos));
  /* temp.textFont(skillTextFont);
  temp.textSize(20);
  temp.text(mouseX,30,40);
  temp.text(mouseY,100,40); */
  //image(temp,630,0); 
  fullCardimg = temp.get();
  fullCard.image(fullCardimg,0,0);
  //console.log(sizeOffs);
  image(fullCard,630,0);
  saveImage();
}

function keyPressed()
{
  //frame = getFrame('Qun',3);
 // skillPlate = loadImage('/docs/assets//SkillPlateQun.png',(loadedPlate)=>{skillPlate=loadedPlate; refresh();})
  //loadImage('/docs/assets//renLin.png',(loadedImage)=>{cardArt=loadedImage; refresh();})
  setTimeout(() => {
    refresh();
  }, "100");
  
}
function mouseWheel(event)
{
  if(mouseX >= 650 && mouseY >= 25)
  {
    //console.log(sizeOffs);
    sizeOffs += event.delta;
    //console.log(sizeOffs);
    refresh();
    event.preventDefault();
    return false;
  }
}
function mouseDragged()
{
  if(mouseX >= 650 && mouseY >= 25)
  {
    artPosX = mouseX-620;
    artPosY = mouseY-25;
    refresh();
  }
}

function mouseClicked()
{
  if(mouseX < 650 && mouseIsPressed)
  {
    refresh();
  }
}