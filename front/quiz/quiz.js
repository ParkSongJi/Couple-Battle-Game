try {
    var queryString = window.location.search;
    var params = new URLSearchParams(queryString);
    var dataId = params.get('dataId');

    if (dataId === 'random') {
        fetch('http://127.0.0.1:8000/question/random', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => updateUI(data, dataId))
        .catch(error => console.error('Error fetching random question:', error));
    } else {
        fetch(`http://127.0.0.1:8000/question/${dataId}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => updateUI(data, dataId))
        .catch(error => console.error(`Error fetching question with ID ${dataId}:`, error));
    }
} catch (error) {
    console.error('Data fetch error:', error.message);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('back').addEventListener('click', function() {
        window.location.href = "../index/index.html";
    });

    document.getElementById('inner-footer').addEventListener('click', function() {
        window.location.href = "../list/list.html";
    });

    document.querySelector('.container').addEventListener('click', function(event) {
        const targetId = event.target.closest('li')?.id;

        if (targetId === 'ok') {
            window.location.href = `../chat/chat.html?dataId=${encodeURIComponent('ok')}&questionId=${encodeURIComponent(questionId)}`;  
        }
        else if (targetId === 'no'){
            window.location.href = `../chat/chat.html?dataId=${encodeURIComponent('no')}&questionId=${encodeURIComponent(questionId)}`; 
        }
    });
});


let questionId;

function updateUI(data, dataId) {
    const listWrap = document.querySelector('.container');
    let html = '';

    if(dataId === 'random'){
        data_que = data.question;
        var startIndex = data_que.indexOf('된다? 안된다?');
        var start = data_que.slice(0, startIndex);
        var end = data_que.substring(startIndex);
        if (data_que.length === 0) { 
            html += `
                <div>
                    <p class="title">&lt; 질문 오류 &gt;</p>
                    <p>질문을 불러오지 못했습니다</p>
                </div>
                <div>
                    <p class="content">데이터를 확인해주세요</p>
                </div>
            `;
        } else {
            html += `
                <div>
                    <p class="title">&lt; ${data.title} &gt;</p>
                    <p>당신의 선택은?</p>
                </div>
                <div>
                    <p class="content">${start}${end}</p>
                </div>
                <div class="select">
                    <ul>
                        <li id="ok">
                            <div class="text">된다</div>
                            <div class="img_area"><img src="../images/menok.png" alt="ok"></div>
                        </li>
                        <li id="no">
                            <div class="text">안된다</div>
                            <div class="img_area"><img src="../images/womenx.png" alt="no"></div>
                        </li>
                    </ul>
                </div>
            `;
        }
        listWrap.innerHTML = html;
        questionId = data._id;
    }
    
    else{
        data_que = data[0].question;
        var startIndex = data_que.indexOf('된다? 안된다?');
        var start = data_que.slice(0, startIndex);
        var end = data_que.substring(startIndex);
        if (data_que.length === 0) { 
            html += `
                <div>
                    <p class="title">&lt; 질문 오류 &gt;</p>
                    <p>질문을 불러오지 못했습니다</p>
                </div>
                <div>
                    <p class="content">데이터를 확인해주세요</p>
                </div>
            `;
        } else {
            html += `
                <div>
                    <p class="title">&lt; ${data[0].title} &gt;</p>
                    <p>당신의 선택은?</p>
                </div>
                <div>
                    <p class="content">${start}${end}</p>
                </div>
                <div class="select">
                    <ul>
                        <li id="ok">
                            <div class="text">된다</div>
                            <div class="img_area"><img src="../images/menok.png" alt="ok"></div>
                        </li>
                        <li id="no">
                            <div class="text">안된다</div>
                            <div class="img_area"><img src="../images/womenx.png" alt="no"></div>
                        </li>
                    </ul>
                </div>
            `;
        }
        listWrap.innerHTML = html;
        questionId = data[0]._id; 
    }
}

