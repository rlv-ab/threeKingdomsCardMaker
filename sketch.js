
function getFrame(faction,health) {
  let fac = loadImage('./docs/assets//'+faction+'Frame'+health+'.png',(loadedFrame)=>{frame=loadedFrame;refresh();});
  skillPlate = loadImage('./docs/assets//SkillPlate'+faction+'.png',(loadedPlate)=>{skillPlate=loadedPlate; refresh();})
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
      
      if(wordStr.includes('\n'))
        {
          linectr++;
          y += 21;
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
          y += 21
          if(p<1) 
          {
            x = sx+50
            p++
          }
          else x = 10
      }
	}
  let offset;
  if(linectr<=2)
  {
    offset=62;
  }
  else
  {
    offset=32;
  }
  console.log(linectr);
  skill.setStartPos(sy);
  skill.setPos((y+offset));
}

var frame,cardArt,skillPlate;
var loadedImages =0;
var skill1,skill2,skill3,skill4;
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
  skillTextFontBold = loadFont('./docs/assets//quadrat-serial-medium.ttf')
  skillTextFont = loadFont('./docs/assets//Quadrat-Serial Regular.ttf')
  skillTitleFont = loadFont('./docs/assets//Impuls BT.ttf')
  nameFont = loadFont('./docs/assets//Mistral Regular.ttf')
}

var in_faction,in_chname, in_hp, in_art, savebtn,
in_skill1,in_skill1name,
in_skill2,in_skill2name,
in_skill3,in_skill3name,
in_skill4,in_skill4name;
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
  document.getElementById(id+'_label').innerHTML = "Faction";
  label.style('position','absolute');
  label.style('left',posX+'px');
  label.style('top',(posY-25)+'px');
  let ref;
  if(type == 'faction')
  {
    ref = createElement('select',
      ['<option value=\"Qun\">Qun</option>',
       '<option value=\"Shu\">Shu</option>',
       '<option value=\"Wei\">Wei</option>',
       '<option value=\"Wu\">Wu</option>',
       '<option value=\"AB\">Applebread</option>'
      ]);
  }
  else
  {
    ref = createElement('select',
      ['<option value=\"3\">3 HP</option>',
       '<option value=\"4\">4 HP</option>',
       '<option value=\"5\">5 HP</option>',
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
  skillArr = [skill1,skill2,skill3,skill4];
  in_skill1 = textBox('Skill 1','input1',100,350,300,100)
  in_skill1name = textBox('noLabel','input1Label',150,314,250,25)
  in_skill2 = textBox('Skill 2','input2',100,500,300,100)
  in_skill2name = textBox('noLabel','input2Label',150,465,250,25)
  in_skill3 = textBox('Skill 3','input3',100,650,300,100)
  in_skill3name = textBox('noLabel','input3Label',150,615,250,25)
  in_skill4 = textBox('Skill 4','input4',100,800,300,100)
  in_skill4name = textBox('noLabel','input3Label',150,765,250,25)
  in_chname = textBox('Character Name',"charNameInput",100,150,300,40)
  in_art = createFileInput(handleImage)
  let filelabel = createElement('fileLabel')
  filelabel.id('file_label');
  document.getElementById('file_label').innerHTML = 'Character Art';
  filelabel.style('position','absolute');
  filelabel.style('left','100px');
  filelabel.style('top','210px');
  in_art.position(100,230,);
  in_faction = dropDown('fac',100,50,150,50,'faction')
  in_hp = dropDown('fac',260,50,150,50,'health')
  in_faction.changed(updateImages);
  in_art.changed(updateImages);
  in_hp.changed(updateImages);
  savebtn = createButton('save card');
  savebtn.style('font-size','')
  savebtn.style('width','150px');
  savebtn.style('height','150px');
  savebtn.mousePressed(saveCard);
  savebtn.position(460,200);

  frame = getFrame(in_faction.value(),in_hp.value());
  skillPlate = loadImage('./docs/assets//SkillPlateQun.png',(loadedPlate)=>{skillPlate=loadedPlate; refresh();})
  loadImage('./docs/assets//dummy.png',(loadedImage)=>{cardArt=loadedImage; refresh();})
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
        cardArt=loadedImage;
        cardArt.resize(630,0);
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
  //resize card art and add it
  fullCard.rect(15,15,640,910);
  fullCard.image(cardArt,15,15);
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
  skillPlate.resize(160,0);
  for(let t=0;t<skillArr.length;t++)
    {
      if(skillArr[t].filled != 0)
      {
        fullCard.image(skillPlate,textX-50,h-(textPos-skillArr[t].startPos+18));
        fullCard.textFont(skillTitleFont);
        fullCard.textSize(30);
        fullCard.fill(255);
        fullCard.stroke(0);
        fullCard.strokeWeight(5);
        fullCard.textAlign(CENTER);
        fullCard.textLeading(24);
        let offset=0;
        if(skillArr[t].title.includes("\n")){offset = 12;}
        fullCard.text(skillArr[t].title,textX+28,h-(textPos-skillArr[t].startPos)+14-offset);
      }
      
    }
  
  fullCard.textFont(nameFont);
  fullCard.textSize(70);
  fullCard.fill(255);
  fullCard.stroke(0);
  fullCard.strokeWeight(10);
  fullCard.textAlign(CENTER);
  fullCard.textLeading(65);
  fullCard.text(chName,textX,h-(namepos));
  image(fullCard,670,0); 
  loadedImages = 0;
}

function keyPressed()
{
  //frame = getFrame('Qun',3);
 // skillPlate = loadImage('/docs/assets//SkillPlateQun.png',(loadedPlate)=>{skillPlate=loadedPlate; refresh();})
  //loadImage('/docs/assets//renLin.png',(loadedImage)=>{cardArt=loadedImage; refresh();})
  setTimeout(() => {
    refresh();
  }, "500");
  
}

function draw()
{

}