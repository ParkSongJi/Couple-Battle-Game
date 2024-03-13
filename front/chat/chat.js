// 뒤로가기
const back = document.getElementById('back')
back.addEventListener('click', (e)=>{ window.history.back();})

// 질문리스트
const list = document.getElementById('list')
list.addEventListener('click', (e)=>{
    window.location.href = '../list/list.html'
})

var queryString = window.location.search;
var params = new URLSearchParams(queryString);
var dataId = params.get('dataId');
var questionId = params.get('questionId')
console.log(dataId)
console.log(questionId)
make_chatbot(dataId)

function make_chatbot(dataId){
    let text = ''; // 변수를 let으로 선언
    if(dataId === 'ok'){
        const chatting = document.getElementById('chatting');
        const chatbot = document.createElement('div');
        chatbot.className = 'chatbot';
        text = '왜 된다고 생각해?'
        chatbot.innerHTML = `
        <div class="profile">
            <div class="imgdiv">
                <img src="../images/girl.png" alt="roni" class="imgpro">
            </div>
        </div>
        <div class="chatbox">
            <div class="name">로니</div>
            <div class="contentC">${text}</div>
        </div>`;
        chatting.appendChild(chatbot);
        chatting.scrollTop = chatting.scrollHeight;
    }else if(dataId === 'no'){
        const chatting = document.getElementById('chatting');
        const chatbot = document.createElement('div');
        chatbot.className = 'chatbot';
        text = '왜 안된다고 생각해?'
        chatbot.innerHTML = `
        <div class="profile">
            <div class="imgdiv">
                <img src="../images/boy.png" alt="roni" class="imgpro">
            </div>
        </div>
        <div class="chatbox">
            <div class="name">토니</div>
            <div class="contentC">${text}</div>
        </div>`;
        chatting.appendChild(chatbot);
        chatting.scrollTop = chatting.scrollHeight;
    }
}



// 전송버튼 클릭
const send = document.getElementById('send')

// Enter 키 입력 이벤트 처리
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        send.click();
    }
});
send.addEventListener('click', (e)=> {
    // 전송 버튼 비활성화
    send.disabled = true;
    try {
        const input = document.getElementById('input').value;
        const regex = /^\s+$/;
        if (regex.test(input) || input.trim() === '') {
            return;
        }
        else{
            const chatting = document.getElementById('chatting');
            const user = document.createElement('div');
            
            user.className = 'user';
            user.innerHTML = `<div class="contentU">${input}</div>`;
            
            chatting.appendChild(user);
            chatting.scrollTop = chatting.scrollHeight;
            document.getElementById('input').value = '';
    
            // const formData = {
            //     input: input
            // }
    
            var queryString = window.location.search;
            var params = new URLSearchParams(queryString);
            var dataId = params.get('dataId');
            var questionId = params.get('questionId')
    
            // const jsonData = JSON.stringify(formData)
    
            if(dataId === 'no'){
                const chatting = document.getElementById('chatting');
                const chatbot = document.createElement('div');
                chatbot.className = 'chatbot';
                
                chatbot.innerHTML = `
                    <div class="profile">
                        <div class="imgdiv">
                            <img src="../images/boy.png" alt="toni" class="imgpro">
                        </div>
                    </div>
                    <div class="chatbox">
                        <div class="name">토니</div>
                        <div class="contentC"><img style="width: 3rem; height: 2rem;" src="../images/loading.gif"></div>
                    </div>`;

                chatting.appendChild(chatbot);

                fetch(`http://127.0.0.1:8000/chat_no`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "input": input,
                        "questionId": questionId
                    })
                })
                .then(res => res.json())
                .then(data => {
                    chatbot.innerHTML = `
                    <div class="profile">
                        <div class="imgdiv">
                            <img src="../images/boy.png" alt="roni" class="imgpro">
                        </div>
                    </div>
                    <div class="chatbox">
                        <div class="name">토니</div>
                        <div class="contentC">${data.prediction}</div>
                    </div>`;
                    chatting.scrollTop = chatting.scrollHeight;
                })
            }else if(dataId === 'ok'){
                const chatting = document.getElementById('chatting');
                const chatbot = document.createElement('div');
                chatbot.className = 'chatbot';
                
                chatbot.innerHTML = `
                    <div class="profile">
                        <div class="imgdiv">
                            <img src="../images/girl.png" alt="roni" class="imgpro">
                        </div>
                    </div>
                    <div class="chatbox">
                        <div class="name">로니</div>
                        <div class="contentC"><img style="width: 3rem; height: 2rem;" src="../images/loading.gif"></div>
                    </div>`;

                chatting.appendChild(chatbot);

                fetch(`http://127.0.0.1:8000/chat_ok`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "input": input,
                    "questionId": questionId
                })
            })
            .then(res => res.json())
            .then(data => {
                
                if (data.prediction) {
                    chatbot.innerHTML = `
                    <div class="profile">
                        <div class="imgdiv">
                            <img src="../images/girl.png" alt="roni" class="imgpro">
                        </div>
                    </div>
                    <div class="chatbox">
                        <div class="name">로니</div>
                        <div class="contentC">${data.prediction}</div>
                    </div>`;
                }
                
                
                
                chatting.scrollTop = chatting.scrollHeight;
            })
        } 
        }     
    } catch (error) {
        console.error('에러 발생:', error);
    } finally {
        // 전송 버튼 다시 활성화
        send.disabled = false;
    }
})
