var btn=document.getElementById("submit");
var box1=document.getElementById("box1");

window.onload= function()
{
    var chat=document.getElementById("chat");
    chat.focus();

    chat.addEventListener("keydown",(event)=>{
        //checking if key pressed if enter key
        if(event.keyCode==13){
            // Prevent the default behavior of the Enter key (e.g., newline in the textarea)
            event.preventDefault();
            //instead do my work
            chat.disabled=true;
            fetchResponse();
        }
    });
}


let messages = [{"role": "system","content": "Act as a marketing advisor and ask me exactly 4 questions one by one which will lead to you giving me a title, caption(seo optimized, text only), hashtags(seo optimized), and location for my poster. The question should include venue and time details(if needed) or any other specific info I must add in the caption. The first question will always ask the purporse or theme of the poster At the end provide me with a Python dictionary. The dictionary should contain the following keys: title, caption, hashtag, and location.  Keep the location value null if the location is not provided."}]

async function fetchResponse()
{

    var chat=document.getElementById("chat");
    //smallContainer(question+ans ka div) ->1) question 2) answer
    var smallContainer=document.createElement("div");
    smallContainer.classList.add("smallContainer");
    smallContainer.setAttribute("id","smallContainer");
    //question div
    var question=document.createElement("div");
    question.classList.add("question");
    var questionPara=document.createElement("p");
    questionPara.innerHTML=chat.value;
    //creating user image
    var userImage=document.createElement("div");
    userImage.classList.add("userImage");
    var image=document.createElement('img');
    image.setAttribute("src","https://i2.wp.com/cdn.auth0.com/avatars/ch.png?ssl=1");
    userImage.appendChild(image);

    //align userimage and question div in one row
    var row=document.createElement("div");
    row.classList.add("row");
    row.appendChild(userImage);
    row.appendChild(question);

    question.appendChild(questionPara);
    // smallContainer.appendChild(image);
    smallContainer.appendChild(row);

    var box1=document.getElementById("box1");
    box1.appendChild(smallContainer);

    // chat.value="";


     
    messages.push({"role": "user","content": `${chat.value}`});
    console.log(messages)
    const options={
        method: 'POST',
        headers:{
            // 'Authorization': "Bearer ",
            'Authorization': "Bearer ",
            'Content-Type': "application/json",
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 150,
        })
    }
    try{
        var response = await fetch("https://api.openai.com/v1/chat/completions",options);
        var data=await response.json();
        var msgData=data.choices[0].message.content;
        chat.value="";

        //answerRow
        var answerRow=document.createElement("div");
        answerRow.classList.add("answerRow");
        var chatgptImage=document.createElement("img");
        chatgptImage.setAttribute("src","https://i2.wp.com/cdn.auth0.com/avatars/ch.png?ssl=1");
        answerRow.appendChild(chatgptImage);
        //answer div
        var answer=document.createElement("div");
        answer.classList.add("answer");
        var answerPara=document.createElement("p");
        answerPara.innerHTML=msgData;

        answer.appendChild(answerPara);
        answerRow.appendChild(answer);

        smallContainer.appendChild(answerRow);
        count = count + 1
        generatePoster()

    } catch(error){
        console.log(error+"");
    }
    chat.disabled=false;
}
