// 데이터패치
let idList = []
try {
    // fetch(`https://port-0-cbg-project-ghdys32blrzmx1y1.sel5.cloudtype.app/question/getAll`)
        fetch('http://127.0.0.1:8000/question/getAll', {
            method: 'get',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const listWrap = document.querySelector('.contain');
            let html = '';
            console.log(data);
            if (data.length === 0) {
                html += `
                <div class='qlist'>
                    <h3>질문을 불러오지 못했습니다</h3>
                </div>
            `;
            } else {
                data.forEach((el) => {
                    idList.push(el._id);
                    html += `
                <div class='qlist' id = ${el._id}>
                    <h3>${el.title}</h3>
                    <p>${el.question}</p>
                </div>
            `;
                });
            }
            listWrap.innerHTML = html;
        });
} catch (error) {
    console.error('데이터 패치 중 오류 발생:', error.message);
}


document.addEventListener('DOMContentLoaded', function() {
    var arrowLeftElements = document.getElementsByClassName('xi-arrow-left');

    // xi-arrow-left 클래스를 가진 요소에 대한 클릭 이벤트 리스너
    for (var i = 0; i < arrowLeftElements.length; i++) {
        arrowLeftElements[i].addEventListener('click', function() {
            // window.location.href = "../quiz/quiz.html?dataId=" + encodeURIComponent(dataId);
            window.history.back();
        });
    }

    // 이벤트 위임을 사용하여 .contain 요소에 클릭 이벤트 리스너 추가
    var containElement = document.querySelector('.contain');
    containElement.addEventListener('click', function(event) {
        // 클릭된 요소 또는 부모 요소 중에 .qlist 클래스를 가진 요소가 있는지 확인
        var qlistElement = event.target.closest('.qlist');

        // .qlist 클래스를 가진 요소가 있는 경우에만 처리
        if (qlistElement) {
            var dataId = qlistElement.id;
            window.location.href = "../quiz/quiz.html?dataId=" + encodeURIComponent(dataId);
        }
    });
});