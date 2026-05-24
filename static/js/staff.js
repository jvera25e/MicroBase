function initStaff() {
    if (document.getElementById('pending-users-container')) {
        loadPendingUsers();
    }
    if (document.getElementById('active-users-container')) {
        loadActiveUsers();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStaff);
} else {
    initStaff();
}

async function loadPendingUsers() {
    const container = document.getElementById('pending-users-container');
    try {
        const res = await fetch(`/api/users/pending?_=${Date.now()}`);
        if (!res.ok) {
            container.innerHTML = '<p class="text-muted">No se pudieron cargar las solicitudes.</p>';
            return;
        }
        const users = await res.json();
        
        if (users.length === 0) {
            container.innerHTML = '<p class="text-muted" style="font-size: 0.9rem;"><i data-lucide="check-circle" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"></i> No hay solicitudes pendientes.</p>';
            lucide.createIcons();
            
            // Si la burbuja global existe, ocultarla
            const badge = document.getElementById('staff-badge');
            if(badge) badge.style.display = 'none';
            return;
        }

        // Si la burbuja global existe, actualizarla
        const badge = document.getElementById('staff-badge');
        if(badge) {
            badge.innerText = users.length;
            badge.style.display = 'inline-flex';
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
        users.forEach(u => {
            html += `
                <div class="glass-panel" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); overflow: hidden;">
                    <div>
                        <strong style="display: block; font-size: 1.1rem; color: var(--text-main);">${u.full_name}</strong>
                        <span style="font-size: 0.85rem; color: var(--text-muted);">${u.email} | CI/RUC: ${u.cedula}</span>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <select id="role-select-${u.id}" class="input-neumorphic" style="padding: 8px 12px; font-size: 0.9rem; height: auto; min-width: 130px;">
                            <option value="empleado">Empleado</option>
                            <option value="bodeguero">Bodeguero</option>
                            <option value="manager">Manager</option>
                        </select>
                        <button class="btn btn-primary" onclick="approveUser(${u.id}, this)">Aprobar</button>
                        <button class="btn btn-secondary" style="background: var(--danger); border-color: var(--danger); color: white;" onclick="rejectUser(${u.id}, this)">Rechazar</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
        lucide.createIcons();
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p class="text-muted">Error de conexión.</p>';
    }
}

async function loadActiveUsers() {
    const container = document.getElementById('active-users-container');
    try {
        const res = await fetch(`/api/users/active?_=${Date.now()}`);
        if (!res.ok) {
            container.innerHTML = '<p class="text-muted">No se pudo cargar el personal activo.</p>';
            return;
        }
        const users = await res.json();
        
        if (users.length === 0) {
            container.innerHTML = '<p class="text-muted" style="font-size: 0.9rem;">No hay personal activo aún.</p>';
            return;
        }

        let html = `
            <table class="data-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        users.forEach(u => {
            // El admin no se puede rechazar/eliminar a sí mismo tan fácilmente desde aquí
            let btnRechazar = u.role === 'admin' ? '' : `<button class="btn-link" style="color: var(--danger);" onclick="rejectUser(${u.id}, this)" title="Eliminar Acceso"><i data-lucide="trash-2" style="width: 16px;"></i></button>`;
            
            html += `
                <tr>
                    <td style="font-family: monospace; color: var(--primary);">${u.employee_code || '-'}</td>
                    <td>${u.full_name}</td>
                    <td>${u.email}</td>
                    <td style="text-transform: capitalize;">${u.role}</td>
                    <td>${btnRechazar}</td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        container.innerHTML = html;
        lucide.createIcons();
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p class="text-muted">Error de conexión.</p>';
    }
}

async function approveUser(id, btn) {
    const role = document.getElementById(`role-select-${id}`).value;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader" class="spin" style="width:16px;"></i> Guardando...';
    btn.disabled = true;
    lucide.createIcons();

    try {
        const res = await fetch(`/api/users/${id}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: role })
        });
        const data = await res.json();
        
        if (res.ok) {
            if (data.email_error) {
                showToast("Usuario aprobado, pero falló el envío del correo de aviso.", "warning");
            } else {
                showToast("Usuario aprobado y notificado por correo.", "success");
            }
            await loadPendingUsers();
            await loadActiveUsers();
        } else {
            showToast("Error al aprobar usuario.", "error");
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    } catch (e) {
        console.error(e);
        showToast("Error de conexión.", "error");
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

async function rejectUser(id, btn) {
    let ok = confirm("¿Seguro que deseas eliminar el acceso de este usuario?");
    if (!ok) return;
    
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader" class="spin" style="width:16px;"></i> Guardando...';
    btn.disabled = true;
    lucide.createIcons();
    
    try {
        const res = await fetch(`/api/users/${id}/reject`, { method: 'POST' });
        const data = await res.json();
        
        if (res.ok) {
            if (data.email_error) {
                showToast("Usuario eliminado, pero falló el envío del correo de aviso.", "warning");
            } else {
                showToast("Usuario eliminado y notificado por correo.", "info");
            }
            await loadPendingUsers();
            await loadActiveUsers();
        } else {
            showToast("Error al eliminar usuario.", "error");
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    } catch (e) {
        console.error(e);
        showToast("Error de conexión.", "error");
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}
