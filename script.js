let prompt=document.querySelector("#prompt")
let submit=document.querySelector("#submit")
let chatContainer=document.querySelector(".chat_container")
// Ye CSS selectors ke through kisi bhi element ko select karta hai:
// .class
// #id
// tagname
// combinations bhi chalega (like div p, ul li, etc.) all about query selector
const Api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAYBNJKHgo27wCdPOcRXfJkD7lSgpN0i_U"
// uper api calling aur uska key ka liya 
let imagebtn=document.querySelector("#image")// image button ka liya 
let imageinput=document.querySelector("#image input[type='file']")// jb hm image  ka under input ko access krna hai 
let image=document.querySelector("#image img")
let user={
     message:null,
     file:{
            mime_type: null,
            data: null,
     }
}
async function generateRespose(aiChatBox) {
    let text=aiChatBox.querySelector(".ai-chat-area")// jo bhi response aaya usko hm ai-chat-box  ka inner html may likh 
    // deyngay 


    let RequestOption={
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify({// ya sb api calling time whi diya rhta tha ki ess ko define kro aur ya fatch may krna  
            // hota hai  lakin  hm obejct banaa kr kr skta hai 
                "contents": [
                {
                    "parts": [
                    {
                        "text": user.message
                    },(user.file.data ? [{"inline_data" :user.file}]:[])
                    ]
                }
                ]
  
        })
    }
     try {
          let response= await fetch(Api_url,RequestOption)
        let data=await response.json();// convert into jsson
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim() // kaha rhata hai 
        // console may usski position hai 
        // trim ki faltu ki cheez  trim kr do 
        text.innerHTML=apiResponse;
        console.log(apiResponse);
     } catch (error) {
        console.log("There is some problem ")
     }

     finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})// jb resposne aaya to hmko neechy
        //jaana hota hai to inbuilt function kaha se ->top ,kaha tk-> jitna height hai ,kyse ->smooth
        //-==> yaha kui ki answer aaya gaa to wo automatic neechay scroll ho jaa aa gaa 

     image.src=`img.svg`// jb result aa jaa aa to jo image chote wala box may ho wo remove ho jaa aa
     image.classList.remove("choose")
    }
  



}
function createchatbox(html,classes){//right

    let div=document.createElement("div");
    div.innerHTML=html;
    div.classList.add(classes);//classes se hm wo html ka under user-chat-bos hai useko show kr rha hai 
    // in simple classes bus nam deyna ka liyaa use ho rha hai ki aagay jaa  kr wo chatContainer ka sth append ho 
    // jaa rha hai 
    return div;
}

function  handlechatresponse(message){//right
    user.message=message;
    let html=`<img src="Screenshot_2025-06-23_065713-removebg-preview.png" alt="" id="userimage" width="8%">
            <div class="user-chat-area" >
             ${user.message}
             ${user.file.data ?` <img src="data:${user.file.mime_type};base64,${user.file.data}"
             class="chooseimg" /> `: "" }
            </div>`//agr hm image diya input may to usska liya hai user.file.data || aur hm usko choosen class may dal diya
    prompt.value=""// when user give input as shown in screen in promt area it is remove 
    let userchatbox=createchatbox(html,"user-chat-box");// jo div aaya ga ussko userchatbox may store krr lunga
        // aur jo div pass kiyaa wo same aaysa aanada chahiya jayassaa ki html may user-chat-box hai 
    chatContainer.appendChild(userchatbox);//jo chat user nay diya prompt may ussko show kr rha hai 
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})// jb resposne aaya to hmko neechy
    //jaana hota hai to inbuilt function kaha se ->top ,kaha tk-> jitna height hai ,kyse ->smooth
    setTimeout(()=> {// kch time baad ai response krnaa lagay  gaa
        let html =`<img src="Screenshot_2025-06-23_065656-removebg-preview.png" alt="" id="aiimage" width="10%">
           <div class="ai-chat-area">
           <img src="https://usagif.com/wp-content/uploads/loading-96.gif" alt="" class="load" width="30px">
           </div>`
        let aiChatBox=createchatbox(html,"ai-chat-box")
        chatContainer.appendChild(aiChatBox);
        generateRespose(aiChatBox)
    },600)
}
prompt.addEventListener("keydown",(e) => {//right
        if(e.key=="Enter"){   // jayse hee hm enter press kiya yaa sb hoga 
            handlechatresponse(prompt.value);//jo user naa diya hai 
        } 
   
})

submit.addEventListener("click" ,() =>{
    handlechatresponse(prompt.value);
})

imageinput.addEventListener("change", ()=>{
    const file=imageinput.files[0]// jo image  aa rha hai ussko file ka under store kraa dunga 
    if(!file) return//no image is in the input 
    // from here we read a file 
     
    let reader=new FileReader()// file reader inbulit class
    reader.onload = (e)=>{// jb reader file ko load kr rha hai to uss time ky ho wo likah jaa rha hai
         // jo file load ho rha hai ussko hmko 64 bit may convert krnaa hoga kui ki api bus 64 janta hai 
         let base64string=e.target.result.split(",")[1]
         user.file={
            mime_type: file.type,
            data: base64string,
     }
     image.src=`data:${user.file.mime_type};base64,${user.file.data}`// to show image into buttom  and here we change 
     // the src of the buttom 
     image.classList.add("choose")// to give the name of class
    }
     
    reader.readAsDataURL(file)// for read a url in bulit function 
})

imagebtn.addEventListener("click" ,()=>{
    imagebtn.querySelector("input").click()
})