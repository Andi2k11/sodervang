// Simple app scaffold for seating chart editor
const state = {
  rooms: [],
  groups: [],
  currentRoomId: null
};

function uid(prefix = ''){return prefix + Math.random().toString(36).slice(2,9)}

/* --- Persistence: export/import JSON --- */
function exportJSON(){
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'sodervang-export.json'; a.click();
  URL.revokeObjectURL(url);
}

function importJSONFile(file){
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const parsed = JSON.parse(e.target.result);
      Object.assign(state, parsed);
      if(state.rooms && state.rooms.length) state.currentRoomId = state.rooms[0].id;
      render();
      alert('Import successful');
    }catch(err){alert('Invalid JSON file')}
  };
  reader.readAsText(file);
}

/* --- Basic room functions --- */
function createRoom(name='Ny sal', cols=6, rows=4){
  const room = {id: uid('r_'), name, cols, rows, desks: []};
  // create grid desks
  for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){
    room.desks.push({id: uid('d_'), x, y, studentId: null, locked:false});
  }
  state.rooms.push(room);
  state.currentRoomId = room.id;
  saveDraft(); render();
}

function getCurrentRoom(){return state.rooms.find(r=>r.id===state.currentRoomId)}

/* --- Rendering --- */
function render(){
  const canvas = document.getElementById('canvas');
  const room = getCurrentRoom();
  if(!room){canvas.textContent = 'Canvas: create a room to begin.'; return}
  canvas.innerHTML = '';
  const grid = document.createElement('div');
  grid.style.display='grid';
  grid.style.gridTemplateColumns = `repeat(${room.cols}, 56px)`;
  grid.style.gap = '8px';
  room.desks.forEach(d=>{
    const el = document.createElement('button');
    el.className = 'seat';
    if(d.locked) el.classList.add('occupied');
    el.textContent = d.studentId ? d.studentId : '';
    el.onclick = ()=>{d.locked = !d.locked; saveDraft(); render();};
    grid.appendChild(el);
  });
  canvas.appendChild(grid);
}

/* --- Draft autosave to localStorage --- */
function saveDraft(){
  try{localStorage.setItem('sodervang.draft', JSON.stringify(state))}catch(e){}
}

function loadDraft(){
  try{
    const raw = localStorage.getItem('sodervang.draft');
    if(!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
    if(state.rooms && state.rooms.length && !state.currentRoomId) state.currentRoomId = state.rooms[0].id;
  }catch(e){}
}

/* --- Wire UI --- */
document.getElementById('newRoom').addEventListener('click', ()=>{
  const name = document.getElementById('roomName').value || 'Ny sal';
  createRoom(name);
});
document.getElementById('exportBtn').addEventListener('click', exportJSON);
const importFile = document.getElementById('importFile');
document.getElementById('importBtn').addEventListener('click', ()=>importFile.click());
importFile.addEventListener('change', (e)=>{const f=e.target.files[0]; if(f) importJSONFile(f); importFile.value='';});

// simple group button (placeholder)
document.getElementById('addGroup').addEventListener('click', ()=>{
  const g = {id: uid('g_'), name: 'Ny grupp', students: []}; state.groups.push(g); saveDraft(); alert('Group added');
});

// init
loadDraft(); render();

export {state};
