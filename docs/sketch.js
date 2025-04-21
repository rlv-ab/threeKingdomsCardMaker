function getFrame(faction,health) {
  let fac = loadImage('assets/'+faction+'Frame'+health+'.png',(loadedFrame)=>{frame=loadedFrame;refresh();});
  skillPlate = loadImage('assets/SkillPlate'+faction+'.png',(loadedPlate)=>{skillPlate=loadedPlate; refresh();})
  return fac;
}

var textString = '$$Once $$per $$action $$phase: When you use **Strike or a **black-colored **basic **scroll **card and designate only one target, you may have another character who could legally be a target of this card choose one of the following options:  \n \n \n **1. **Give **you **a **card, then become the user of this card in your place. \n **2. **Also **become **a **target of this card.';
var w = 672, h = 944;
var boxW=570, boxH=400;
let pg,fullCard;

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
  console.log(linectr);
  skill.setStartPos(sy);
  skill.setPos((y+offset));
}

var frame,cardArt,skillPlate,modifyPlate,UnlockPlate;
var artOffset;
var loadedImages =0;
var skill1,skill2,skill3,skill4,skill5,skill6;
var skillArr;
var chName, art,hp,faction

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
}

var in_faction,in_chname, in_hp, in_art, savebtn,
art_uncropped, plateArr,
in_skill1,in_skill1name, in_plate1,
in_skill2,in_skill2name, in_plate2,
in_skill3,in_skill3name, in_plate3,
in_skill4,in_skill4name, in_plate4,
in_skill5,in_skill5name, in_plate5,
in_skill6,in_skill6name, in_plate6;
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
         '<option value=\"Unlock\">Unlock</option>',
        ]);
    }
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
  let offsetLabel = createElement('offsLabel')
  offsetLabel.id('offs_label');
  document.getElementById('offs_label').innerHTML = 'Art Position';
  offsetLabel.style('position','absolute');
  offsetLabel.style('left','450px');
  offsetLabel.style('top','30px');
  artOffset = createSlider(0,255);
  artOffset.position(450,50);
  artOffset.input(() => {refresh();});
  in_faction.changed(updateImages);
  in_art.changed(updateImages);
  in_hp.changed(updateImages);
  savebtn = createButton('save card');
  savebtn.style('font-size','')
  savebtn.style('width','150px');
  savebtn.style('height','150px');
  savebtn.mousePressed(saveCard);
  savebtn.position(460,100);

  frame = getFrame(in_faction.value(),in_hp.value());
  skillPlate = loadImage('assets/SkillPlateQun.png',(loadedPlate)=>{skillPlate=loadedPlate; refresh();})
  loadImage('assets/dummy.png',(loadedImage)=>{art_uncropped=loadedImage; refresh();})
}

function saveCard()
{
  save(fullCard,'Card_'+chName+'.png')
}
function handleImage(file)
{
  
  if(file.type === 'image')
  {
    
    loadImage(file.data,(loadedImage)=>
      {
        art_uncropped=loadedImage;
        art_uncropped.resize(0,910);
        refresh();
      })
  }
}
function updateImages()
{
  frame = getFrame(in_faction.value(),in_hp.value());
  //loadImage(in_art.value(),(loadedImage)=>{cardArt=loadedImage; refresh();})
}

function refresh()
{
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
  fullCard.rect(15,15,640,910);
  cardArt = art_uncropped.get(0+artOffset.value(),0,630,h);
  fullCard.image(cardArt,10,20);
  //create skill text boxes
  pg = createGraphics(boxW, h);
  pg.background(235,219,228,220);
  for(let t=0;t<skillArr.length;t++)
  {
    if(skillArr[t].filled != 0)
    {
      textSkill(pg,skillArr[t].text,65,textPos+19,h,boxW-47,skillArr[t]);
      textPos = skillArr[t].pos-42;
    }
  }
  textPos+=42
  if(textPos>500)
  {
    namepos += 100
  }
  //add text to text box and add it to card
  fullCard.image(pg,textX,h-textPos);
  //add card frame
  fullCard.image(frame,0,0,posx,posy);
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
        fullCard.image(plt,textX-50,h-(textPos-skillArr[t].startPos+18));
        fullCard.textFont(skillTitleFont);
        fullCard.textSize(30);
        fullCard.fill(255);
        fullCard.stroke(0);
        fullCard.strokeWeight(5);
        if(ttoffs != 0)
          {
            fullCard.textAlign(LEFT);
          }
          else fullCard.textAlign(CENTER);
        fullCard.textLeading(24);
        let offset=0;
        if(plateArr[t].value() == 'Modify' || 
           plateArr[t].value() == 'Unlock')
        {
          offset =-3
        }
        if(skillArr[t].title.includes("\n")){offset = 12;}
        fullCard.text(skillArr[t].title,textX+28+ttoffs,h-(textPos-skillArr[t].startPos)+14-offset);
      }
      
    }
  
  fullCard.textFont(nameFont);
  fullCard.textSize(70);
  fullCard.fill(255);
  fullCard.stroke(0);
  fullCard.strokeWeight(10);
  fullCard.textAlign(CENTER);
  fullCard.textLeading(65);
  fullCard.text(chName,textX+ttoffs,h-(namepos));
  image(fullCard,630,0); 
  loadedImages = 0;
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

function mouseClicked()
{
  refresh();
}