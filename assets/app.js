(() => {
  const cfg = window.APP_CONFIG || {};
  const TABLE_LOTS = cfg.TABLES?.LOTS || 'lots';
  const TABLE_PARTICIPANTS = cfg.TABLES?.PARTICIPANTS || 'participants';

  if (!window.supabase || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    alert('Supabase não configurado. Edite assets/config.js com SUPABASE_URL e SUPABASE_ANON_KEY.');
    throw new Error('Supabase config ausente');
  }
  const supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  function explain(err, context){
    try {
      const msg = (err && (err.message || err.error_description || err.error || JSON.stringify(err))) || 'erro desconhecido';
      console.error('SUPABASE ERROR @'+context+':', err);
      return context + ': ' + msg;
    } catch(e){ return context + ': erro'; }
  }

  // ======= DB Layer (Supabase only) =======
  const db = {
    async listLots() {
      const { data, error } = await supabaseClient.from(TABLE_LOTS).select('*').order('id',{ascending:true});
      if (error) throw new Error(explain(error, 'DB')); return data||[];
    },
    async listOpenLots() {
      const { data, error } = await supabaseClient.from(TABLE_LOTS).select('*').eq('status','open').order('id',{ascending:true});
      if (error) throw new Error(explain(error, 'DB')); return data||[];
    },
    async upsertLot(lot) {
      const { data, error } = await supabaseClient.from(TABLE_LOTS).upsert(lot).select().maybeSingle();
      if (error) throw new Error(explain(error, 'DB')); return data;
    },
    async deleteLot(id) {
      const { error } = await supabaseClient.from(TABLE_LOTS).delete().eq('id', id);
      if (error) throw new Error(explain(error, 'DB'));
    },
    async listParticipants() {
      const { data, error } = await supabaseClient.from(TABLE_PARTICIPANTS).select('*').order('id',{ascending:true});
      if (error) throw new Error(explain(error, 'DB')); return data||[];
    },
    async searchParticipants(q) {
      const query = (q||'').trim();
      if(!query) return this.listParticipants();
      const { data, error } = await supabaseClient
        .from(TABLE_PARTICIPANTS)
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('id',{ascending:true});
      if (error) throw new Error(explain(error, 'DB')); return data||[];
    },
    async insertParticipant(p) {
      const { data, error } = await supabaseClient
        .from(TABLE_PARTICIPANTS)
        .insert({
          name:p.name, email:p.email, phone:p.phone,
<<<<<<< HEAD
          ticket_type:p.ticket_type, lot_id:p.lot_id || null, status:p.status || 'pendente'
=======
          ticket_type:'Inteira', lot_id:p.lot_id || null, status:p.status || 'pendente'
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)
        })
        .select().single();
      if (error) throw new Error(explain(error, 'DB')); return data;
    },
    async upsertParticipant(p) {
<<<<<<< HEAD
=======
      if(!p.ticket_type) p.ticket_type = 'Inteira'; // segurança por causa do NOT NULL
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)
      const { data, error } = await supabaseClient.from(TABLE_PARTICIPANTS).upsert(p).select().maybeSingle();
      if (error) throw new Error(explain(error, 'DB')); return data;
    },
    async deleteParticipant(id) {
      const { error } = await supabaseClient.from(TABLE_PARTICIPANTS).delete().eq('id', id);
      if (error) throw new Error(explain(error, 'DB'));
    },
    async setParticipantStatus(id, status) {
      const { error } = await supabaseClient.from(TABLE_PARTICIPANTS).update({status}).eq('id', id);
      if (error) throw new Error(explain(error, 'DB'));
    }
  };

  // ======= UI Helpers =======
  const money = v => `R$ ${Number(v || 0).toFixed(2)}`;
  const badgeStatus = s => {
    const ok = (s || 'pendente').toLowerCase() === 'presente';
    return `<span class="badge rounded-pill ${ok ? 'text-bg-success' : 'text-bg-secondary'} badge-status">${s || 'pendente'}</span>`;
  };

<<<<<<< HEAD
  // ======= Public Registration =======
  async function initRegistrationPage() {
    const form = document.getElementById('registration-form');
    if (!form) return;
    const lotSelect = document.getElementById('lot-select');
    const ticketSelect = document.getElementById('ticket-type');
    const success = document.getElementById('success-message');
    const paymentBtn = document.getElementById('payment-button');

    ['Inteira','Meia'].forEach(t=>{
      const op=document.createElement('option'); op.value=t; op.textContent=t; ticketSelect.appendChild(op);
    });
=======
  // ======= Public Registration (no ticket select) =======
  async function initRegistrationPage() {
    const form = document.getElementById('registration-form');
    if (!form) return;

    const lotSelect   = document.getElementById('lot-select');
    const success     = document.getElementById('success-message');
    const paymentBtn  = document.getElementById('payment-button');
    const submitBtn   = form.querySelector('button[type="submit"]');
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)

    try {
      const lots = await db.listOpenLots();
      lotSelect.innerHTML = '';
<<<<<<< HEAD
      lots.forEach(l=>{
        const op=document.createElement('option'); op.value=l.id; op.textContent=`${l.name} — ${money(l.price)}`; lotSelect.appendChild(op);
      });
    } catch (err) { alert('Erro ao carregar lotes: '+(err?.message||'desconhecido')); }
=======

      if (!lots.length) {
        const op = document.createElement('option');
        op.disabled = true; op.selected = true;
        op.textContent = 'Nenhum lote disponível';
        lotSelect.appendChild(op);
        if (submitBtn) submitBtn.disabled = true;
      } else {
        lots.forEach(l=>{
          const op=document.createElement('option');
          op.value=l.id;
          op.textContent=`${l.name} — ${money(l.price)}`;
          lotSelect.appendChild(op);
        });
        if (submitBtn) submitBtn.disabled = false;
      }
    } catch (err) {
      alert('Erro ao carregar lotes: ' + (err?.message || 'desconhecido'));
      if (submitBtn) submitBtn.disabled = true;
    }
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const payload = {
<<<<<<< HEAD
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        ticket_type: ticketSelect.value,
        lot_id: Number(lotSelect.value),
=======
        name:  document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        lot_id: Number(lotSelect.value),
        ticket_type: 'Inteira',
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)
        status: 'pendente'
      };
      try{
        await db.insertParticipant(payload);
        form.classList.add('d-none');
        success.classList.remove('d-none');
        paymentBtn?.addEventListener('click', ()=> window.location.href='payment.html');
      }catch(err){
<<<<<<< HEAD
        alert('Erro ao registrar: '+(err?.message||'desconhecido'));
=======
        alert('Erro ao registrar: ' + (err?.message || 'desconhecido'));
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)
      }
    });
  }

  // ======= Admin: Lotes =======
  function openLotModal(data=null){
    document.getElementById('lot-id').value = data?.id || '';
    document.getElementById('lot-name').value = data?.name || '';
    document.getElementById('lot-price').value = data?.price ?? '';
    document.getElementById('lot-limit').value = data?.limit ?? '';
    document.getElementById('lot-status').value = data?.status || 'open';
    new bootstrap.Modal('#lotModal').show();
  }
  async function renderLotsTable(){
    const tbody = document.querySelector('#lots-table tbody');
    if(!tbody) return;
    let lots = [];
    try { lots = await db.listLots(); } catch(err){ alert('Erro ao carregar lotes: '+err.message); return; }
    tbody.innerHTML = lots.map(l=>`
      <tr>
        <td>${l.id}</td><td>${l.name}</td><td>${money(l.price)}</td><td>${l.limit}</td><td>${l.status}</td>
        <td class="text-end">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary" data-action="edit" data-id="${l.id}">Editar</button>
            <button class="btn btn-outline-danger" data-action="del" data-id="${l.id}">Excluir</button>
          </div>
        </td>
      </tr>`).join('');
    tbody.querySelectorAll('[data-action="edit"]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id=btn.getAttribute('data-id');
        const lot = lots.find(x=>String(x.id)===String(id));
        openLotModal(lot);
      });
    });
    tbody.querySelectorAll('[data-action="del"]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const id=btn.getAttribute('data-id');
        if(confirm('Excluir lote?')){
          try { await db.deleteLot(id); renderLotsTable(); } catch(err){ alert('Erro ao excluir: '+err.message); }
        }
      });
    });
    document.getElementById('save-lot-btn')?.addEventListener('click', async ()=>{
      const id = document.getElementById('lot-id').value;
      const lot = {
        name: document.getElementById('lot-name').value.trim(),
        price: parseFloat(document.getElementById('lot-price').value || '0'),
        limit: parseInt(document.getElementById('lot-limit').value || '0'),
        status: document.getElementById('lot-status').value
      };
      if(id) lot.id = Number(id);
      try{
        await db.upsertLot(lot);
        bootstrap.Modal.getInstance(document.getElementById('lotModal')).hide();
        renderLotsTable();
      }catch(err){ alert('Erro ao salvar lote: '+err.message); }
    });
  }

  // ======= Admin: Participantes =======
  async function fillParticipantLotOptions(){
    const select = document.getElementById('participant-lot');
    if(!select) return;
    let lots = [];
    try { lots = await db.listLots(); } catch {}
    select.innerHTML = '<option value="">(sem lote)</option>' + lots.map(l=>`<option value="${l.id}">${l.name}</option>`).join('');
  }
  function openParticipantModal(p=null){
    document.getElementById('participant-id').value = p?.id || '';
    document.getElementById('participant-name').value = p?.name || '';
    document.getElementById('participant-email').value = p?.email || '';
    document.getElementById('participant-phone').value = p?.phone || '';
<<<<<<< HEAD
    document.getElementById('participant-ticket').value = p?.ticket_type || 'Inteira';
=======
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)
    document.getElementById('participant-status').value = p?.status || 'pendente';
    document.getElementById('participant-lot').value = p?.lot_id || '';
    new bootstrap.Modal('#participantModal').show();
  }
  async function renderParticipantsTable(){
    const tbody = document.querySelector('#participants-table tbody');
    if(!tbody) return;
    let participants = [];
    try { participants = await db.listParticipants(); } catch(err){ alert('Erro ao carregar participantes: '+err.message); return; }
    tbody.innerHTML = participants.map(p=>`
      <tr>
<<<<<<< HEAD
        <td>${p.id}</td><td>${p.name||''}</td><td>${p.email||''}</td><td>${p.phone||''}</td>
        <td>${p.ticket_type||''}</td><td>${p.lot_id||''}</td><td>${badgeStatus(p.status)}</td>
=======
        <td>${p.id}</td><td>${p.name||''}</td><td>${p.email||''}</td><td>${p.phone||''}</td><td>${p.lot_id||''}</td><td>${badgeStatus(p.status)}</td>
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)
        <td class="text-end">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary" data-action="edit" data-id="${p.id}">Editar</button>
            <button class="btn btn-outline-danger" data-action="del" data-id="${p.id}">Excluir</button>
            <button class="btn btn-outline-success" data-action="status" data-next="presente" data-id="${p.id}">Presente</button>
            <button class="btn btn-outline-secondary" data-action="status" data-next="pendente" data-id="${p.id}">Pendente</button>
          </div>
        </td>
      </tr>`).join('');
    tbody.querySelectorAll('[data-action="edit"]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const id = btn.getAttribute('data-id');
        const p = participants.find(x=>String(x.id)===String(id));
        await fillParticipantLotOptions();
        openParticipantModal(p);
      });
    });
    tbody.querySelectorAll('[data-action="del"]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const id = btn.getAttribute('data-id');
        if(confirm('Excluir participante?')){
          try{ await db.deleteParticipant(id); renderParticipantsTable(); } catch(err){ alert('Erro ao excluir: '+err.message); }
        }
      });
    });
    tbody.querySelectorAll('[data-action="status"]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const id = btn.getAttribute('data-id');
        const next = btn.getAttribute('data-next');
        try{ await db.setParticipantStatus(id, next); renderParticipantsTable(); } catch(err){ alert('Erro ao atualizar: '+err.message); }
      });
    });
  }

  // ======= Admin: Check-in =======
  async function renderAdminCheckinTable(){
    const tbody = document.querySelector('#admin-checkin-table tbody');
    if(!tbody) return;
    const q = (document.getElementById('admin-search-input')?.value || '').toLowerCase().trim();
    let people = [];
    try { people = await db.searchParticipants(q); } catch(err){ alert('Erro ao buscar: '+err.message); return; }
    tbody.innerHTML = people.map(p=>`
      <tr>
        <td>${p.name||''}</td><td>${p.email||''}</td><td>${p.phone||''}</td>
        <td>${badgeStatus(p.status)}</td>
        <td class="text-end">
          <button class="btn btn-sm ${p.status==='presente'?'btn-outline-secondary':'btn-outline-success'} toggle-status"
                  data-id="${p.id}" data-next="${p.status==='presente'?'pendente':'presente'}">
            Marcar ${p.status==='presente'?'pendente':'presente'}
          </button>
        </td>
      </tr>`).join('');
    tbody.querySelectorAll('.toggle-status').forEach(btn=>{
      btn.addEventListener('click', async (e)=>{
        const id = e.currentTarget.getAttribute('data-id');
        const next = e.currentTarget.getAttribute('data-next');
        try{ await db.setParticipantStatus(id, next); }catch(err){ alert('Erro ao atualizar: '+err.message); }
        const msg = document.getElementById('checkin-message');
        if(msg){
          const target = people.find(x=>String(x.id)===String(id));
          msg.textContent = `${target?.name || 'Participante'} marcado como ${next}.`;
          msg.classList.remove('d-none');
          setTimeout(()=>msg.classList.add('d-none'), 2500);
        }
        renderAdminCheckinTable();
      });
    });
  }

  // ======= Common =======
  function wireLogout(){
    document.getElementById('logout-btn')?.addEventListener('click', ()=>{
      localStorage.removeItem('adminAuth');
      window.location.href='admin-login.html';
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    wireLogout();
    if(document.getElementById('registration-form')) initRegistrationPage();
    if(document.getElementById('lots-table')) { renderLotsTable(); }
    if(document.getElementById('participants-table')) {
      fillParticipantLotOptions();
      document.getElementById('btn-new-participant')?.addEventListener('click', async ()=>{
        await fillParticipantLotOptions();
        openParticipantModal(null);
      });
      document.getElementById('save-participant-btn')?.addEventListener('click', async ()=>{
        const id = document.getElementById('participant-id').value;
        const data = {
          name: document.getElementById('participant-name').value.trim(),
          email: document.getElementById('participant-email').value.trim(),
          phone: document.getElementById('participant-phone').value.trim(),
<<<<<<< HEAD
          ticket_type: document.getElementById('participant-ticket').value,
=======
          ticket_type: 'Inteira', // default para satisfazer NOT NULL do schema atual
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)
          lot_id: document.getElementById('participant-lot').value || null,
          status: document.getElementById('participant-status').value
        };
        if(id) data.id = Number(id);
<<<<<<< HEAD
        try{ await db.upsertParticipant(data); bootstrap.Modal.getInstance(document.getElementById('participantModal')).hide(); renderParticipantsTable(); }catch(err){ alert('Erro ao salvar: '+err.message); }
=======
        try{
          await db.upsertParticipant(data);
          bootstrap.Modal.getInstance(document.getElementById('participantModal')).hide();
          renderParticipantsTable();
        }catch(err){ alert('Erro ao salvar: '+err.message); }
>>>>>>> faad88f (fix(admin): remove coluna 'tipo de ingresso' e mantém 'lote' visível)
      });
      renderParticipantsTable();
    }
    if(document.getElementById('admin-checkin-table')){
      document.getElementById('admin-search-input')?.addEventListener('input', renderAdminCheckinTable);
      renderAdminCheckinTable();
    }
  });
})();
