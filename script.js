let teachers = [
    {id:1, name:"Teacher A", busy:""},
    {id:2, name:"Teacher B", busy:"09AM"},
    {id:3, name:"Teacher C", busy:""},
    {id:4, name:"Teacher D", busy:"11AM"},
    {id:5, name:"Teacher E", busy:""}
];

let requests = [];

// Request Leave
function requestLeave() {
    let tid = parseInt(document.getElementById("tid").value);
    let date = document.getElementById("date").value.trim();
    let time = document.getElementById("time").value.trim().toUpperCase();

    if(!tid || !date || !time){
        alert("Fill all fields!");
        return;
    }

    let req = {
        id: requests.length+1,
        requester: tid,
        date: date,
        time: time,
        substituteAccepted: false,
        adminApproved: false,
        substitute: null
    };

    requests.push(req);
    showFreeTeachers(req.id);
    showPending();
}

// Show Free Teachers
function showFreeTeachers(rid) {
    let list = document.getElementById("freeList");
    list.innerHTML = "";
    let req = requests.find(r => r.id === rid);

    teachers.forEach(t => {
         let busy =
        t.busy.trim().toUpperCase();
       if(busy ==="") busy = "FREE";
       if(busy !== req.time){
                  let li = document.createElement("li");
            li.innerHTML = `${t.name} <button onclick="acceptSub(${t.id}, ${rid})">Accept</button>`;
            list.appendChild(li);
        }
    });

    if(list.innerHTML === "") list.innerHTML = "No free teachers available!";
}

// Accept Substitute
function acceptSub(tid, rid) {
    let req = requests.find(r => r.id === rid);
    req.substituteAccepted = true;
    req.substitute = tid;

    let t = teachers.find(x => x.id === tid);
    t.busy = req.time;

    alert(`${t.name} accepted substitute. Waiting for Admin approval.`);
    document.getElementById("freeList").innerHTML = "";
    showPending();
}

// Show Pending Requests (Admin)
function showPending() {
    let table = document.querySelector("#pending tbody");
    table.innerHTML = "";

    requests.forEach(r => {
        if(r.substituteAccepted && !r.adminApproved){
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${r.id}</td>
                <td>${r.requester}</td>
                <td>${r.date}</td>
                <td>${r.time}</td>
                <td>${r.substitute}</td>
                <td>
                    <button class="approve" onclick="approve(${r.id})">Approve</button>
                    <button class="reject" onclick="reject(${r.id})">Reject</button>
                </td>`;
            table.appendChild(row);
        }
    });
}

// Approve Leave
function approve(id){
    let r = requests.find(x => x.id === id);
    r.adminApproved = true;
    let requester = teachers.find(t => t.id === r.requester);
    let substitute = teachers.find(t => t.id === r.substitute);
    alert(`ADMIN APPROVED. ${substitute.name} will take ${requester.name}'s class at ${r.time}`);
    showPending();
}

// Reject Leave
function reject(id){
    let r = requests.find(x => x.id === id);
    let substitute = teachers.find(t => t.id === r.substitute);
    substitute.busy = "";
    r.substitute = null;
    r.substituteAccepted = false;
    alert(`ADMIN REJECTED leave.`);
    showPending();
}