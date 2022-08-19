const eventSource = new EventSource("http://localhost:8080/sender/ssar/receiver/cos");

eventSource.onmessage = (event) => {
    // console.log(1, event);
    const data = JSON.parse(event.data);
    // console.log(2, data);

    //서버에서 데이터를 가져온 후 데이터 파싱 함수호출
    initMessage(data.msg, data);
}




function getSendMsgBox(msg, data) {
    let today = new Date();

    let year = today.getFullYear(); // 년도
    let month = (("00" + (today.getMonth() + 1)).slice(-2));  // 월
    let date = (("00" + (today.getDate() + 1)).slice(-2));  // 날짜
    let day = today.getDay();  // 요일

    let hours = (("00" + today.getHours()).slice(-2)); // 시
    let minutes = (("00" + today.getMinutes()).slice(-2));  // 분
    let seconds = (("00" + today.getSeconds()).slice(-2));  // 초
    let milliseconds = today.getMilliseconds(); // 밀리초

    // console.log(year + '-' + month + '-' + date);
    // console.log(hours + ':' + minutes + ':' + seconds + ':' + milliseconds);
    //console.log(data);
    let todayDate = year + '-' + month + '-' + date; //오늘 날짜

    if (data != undefined) { //데이터를 서버에서 가져올때
        console.log(data.createdAt);
        if (data.createdAt != undefined && data.createdAt != null && data.createdAt != "") {
            let dbDate = new Date(data.createdAt);
            year = dbDate.getFullYear(); // 년도
            month = (("00" + (dbDate.getMonth() + 1)).slice(-2));  // 월
            date = (("00" + (dbDate.getDate() + 1)).slice(-2));  // 날짜

            minutes = (("00" + dbDate.getMinutes()).slice(-2));  // 분
            seconds = (("00" + dbDate.getSeconds()).slice(-2));  // 초
        }

    } else {
        //엔터키를 br 태그로 전환
        msg = msg.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }

    let dayDiffer = getDateDiff(todayDate, year + '-' + month + '-' + date);
    if (dayDiffer === 0) dayDiffer = "오늘";
    else dayDiffer = dayDiffer + "일전";



    return `
    <div class="sent_msg">
                <p>${msg}</p>
                <span class="time_date"> ${hours}:${minutes} | ${dayDiffer}</span>
    </div>
    `;
}

const getDateDiff = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffDate = date1.getTime() - date2.getTime();
    return Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
}


function initMessage(historyMsg, data) {
    let chatBox = document.querySelector("#chat-box");
    let chatOutgoinBox = document.createElement("div");

    chatOutgoinBox.className = "outgoing_msg";
    chatOutgoinBox.innerHTML = getSendMsgBox(historyMsg, data);
    chatBox.append(chatOutgoinBox);
}


function addMessage() {
    let chatBox = document.querySelector("#chat-box");
    let chatOutgoinBox = document.createElement("div");
    let msgInput = document.querySelector("#chat-outgoing-msg");

    chatOutgoinBox.className = "outgoing_msg";
    chatOutgoinBox.innerHTML = getSendMsgBox(msgInput.value);
    chatBox.append(chatOutgoinBox);
    msgInput.value = "";
}

document.querySelector("#chat-outgoing-button").addEventListener("click", () => {
    //alert("클릭");
    addMessage();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keyup", (e) => {
    // console.log(e.target.value);
    if (e.keyCode === 13) {
        //  console.log("enter key");
    }
});
