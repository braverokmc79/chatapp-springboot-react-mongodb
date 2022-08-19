//로그인 시스템 대신 임시 방편
let username = prompt("아이디를 입력하세요.");
let roomNum = prompt("채팅방 번호를 입력하세요.");

//SSE 연결하기
//const eventSource = new EventSource("http://localhost:8080/sender/ssar/receiver/cos");
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);

eventSource.onmessage = (event) => {
    // console.log(1, event);
    const data = JSON.parse(event.data);

    document.querySelector("#title").innerHTML = roomNum + "번 방";
    document.querySelector(".username").innerText = username;


    if (data.sender === username) { //로그인한 유저가 보낸 메시지
        //파란박스 (오른쪽)
        initMyMessage(data);
    } else {
        //회색밗(왼쪽)
        initYourMessage(data);
    }

    //서버에서 데이터를 가져온 후 데이터 파싱 함수호출
    // initMyMessage(data);
}

//파란박스 만들기
function getSendMsgBox(data) {
    //날짜 가공
    let mDate = manufactureDate(data);

    return `
    <div class="sent_msg">
                <p>${data.msg}</p>
                <span class="time_date"> ${mDate.day} ${mDate.hours}:${mDate.minutes} | ${mDate.dayDiffer}  / ${data.sender} </span>
    </div>
    `;
}


//회색박스 만들기
function getReceiveMsgBox(data) {
    //날짜 가공
    let mDate = manufactureDate(data);

    return `
        <div class="received_withd_msg">
                <p>${data.msg}</p>
                <span class="time_date"> ${mDate.day} ${mDate.hours}:${mDate.minutes} | ${mDate.dayDiffer} / ${data.sender}</span>
        </div>
    `;
}




//최초 초기화뙬 때 1번방 3건이 있으면 3건을 다 가져옴
//addMessage() 함수 호출시 DB에 insert 되고, 그 데이터가 자동으로 흘러들어감(SSE)
//파란박스 초기화 하기
function initMyMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    let sendBox = document.createElement("div");

    sendBox.className = "outgoing_msg";
    sendBox.innerHTML = getSendMsgBox(data);
    chatBox.append(sendBox);

    document.documentElement.scrollTop = document.body.scrollHeight;

}

//회색박스 초기화 하기
function initYourMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    let receivedBox = document.createElement("div");

    receivedBox.className = "received_msg";
    receivedBox.innerHTML = getReceiveMsgBox(data);
    chatBox.append(receivedBox);

    document.documentElement.scrollTop = document.body.scrollHeight;
}


//DB 에 등록시 자동으로 Flux 처리되어 채팅 목록으로 표시됨
async function addMessage() {
    let msgInput = document.querySelector("#chat-outgoing-msg");

    //엔터시 <br/> 변경
    msg = msgInput.value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    let chat = {
        sender: username,
        roomNum: roomNum,
        msg: msg
    }

    await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(chat)
    })
        .then((res) => res.json())
        .then(data => {
            //console.log("data ", data);
        })
        .catch(error => {
            console.log("에러 :", error);
        })

    // chatOutgoinBox.className = "outgoing_msg";
    // chatOutgoinBox.innerHTML = getSendMsgBox(msgInput.value);
    // chatBox.append(chatOutgoinBox);
    msgInput.value = "";
}







//날짜 가공 함수
function manufactureDate(data) {
    let today = new Date();

    let year = today.getFullYear(); // 년도
    let month = (("00" + (today.getMonth() + 1)).slice(-2));  // 월
    let date = (("00" + (today.getDate() + 1)).slice(-2));  // 날짜
    let day = today.getDay();  // 요일

    let hours = (("00" + today.getHours()).slice(-2)); // 시
    let minutes = (("00" + today.getMinutes()).slice(-2));  // 분
    let seconds = (("00" + today.getSeconds()).slice(-2));  // 초
    let milliseconds = today.getMilliseconds(); // 밀리초

    let todayDate = year + '-' + month + '-' + date; //오늘 날짜

    //console.log("data.createdAt : ", data.createdAt);

    let dbDate = new Date(data.createdAt);
    year = dbDate.getFullYear(); // 년도
    month = (("00" + (dbDate.getMonth() + 1)).slice(-2));  // 월
    date = (("00" + (dbDate.getDate() + 1)).slice(-2));  // 날짜

    hours = (("00" + dbDate.getHours()).slice(-2));  // 분
    minutes = (("00" + dbDate.getMinutes()).slice(-2));  // 분
    seconds = (("00" + dbDate.getSeconds()).slice(-2));  // 초


    let dayDiffer = getDateDiff(todayDate, year + '-' + month + '-' + date);
    if (dayDiffer === 0) dayDiffer = "오늘";
    else dayDiffer = dayDiffer + "일전";

    const mDate = {
        "day": year + '-' + month + '-' + date,
        "hours": hours,
        "minutes": minutes,
        "dayDiffer": dayDiffer
    }

    return mDate;
}

const getDateDiff = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffDate = date1.getTime() - date2.getTime();
    return Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
}


document.querySelector("#chat-outgoing-button").addEventListener("click", () => {
    //alert("클릭");
    addMessage();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keyup", (e) => {
    // console.log(e.target.value);
    if (e.keyCode === 13) {
        //  console.log("enter key");
        addMessage();
    }
});
