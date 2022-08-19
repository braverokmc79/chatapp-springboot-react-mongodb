function getMsg(msg) {
    let today = new Date();

    let year = today.getFullYear(); // 년도
    let month = (("00" + (today.getMonth() + 1)).slice(-2));  // 월
    let date = (("00" + (today.getDate() + 1)).slice(-2));  // 날짜
    let day = today.getDay();  // 요일

    let hours = (("00" + today.getHours()).slice(-2)); // 시
    let minutes = (("00" + today.getMinutes()).slice(-2));  // 분
    let seconds = (("00" + today.getSeconds()).slice(-2));  // 초
    let milliseconds = today.getMilliseconds(); // 밀리초

    console.log(year + '-' + month + '-' + date);
    console.log(hours + ':' + minutes + ':' + seconds + ':' + milliseconds);

    let dayDiffer = getDateDiff("2022-08-15", year + '-' + month + '-' + date);
    if (dayDiffer === 0) {
        dayDiffer = "오늘";
    } else {
        dayDiffer = dayDiffer + "일전";
    }
    //엔터키를 br 태그로 전환
    msg = msg.replace(/(?:\r\n|\r|\n)/g, '<br />');
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

document.querySelector("#chat-outgoing-button").addEventListener("click", () => {
    //alert("클릭");
    let chatBox = document.querySelector("#chat-box");
    let chatOutgoinBox = document.createElement("div");

    chatOutgoinBox.className = "outgoing_msg";
    chatOutgoinBox.innerHTML = getMsg(document.querySelector("#chat-outgoing-msg").value);
    chatBox.append(chatOutgoinBox);
    document.querySelector("#chat-outgoing-msg").value = "";
});

document.querySelector("#chat-outgoing-msg").addEventListener("keyup", (e) => {
    console.log(e.target.value);
    if (e.keyCode === 13) {
        console.log("enter key");
    }
});
