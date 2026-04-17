// Configuración de Supabase
const SUPABASE_URL = 'https://nanjqnyvcgxovghwfbgb.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmpxbnl2Y2d4b3ZnaHdmYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzM3MTgsImV4cCI6MjA5MTk0OTcxOH0.yXx-6A4lpYPqh3dLdSGXpjq7Cp3C6QYDb1C72mYuVIg'; 

let supabaseClient = null;

// Intentamos inicializar Supabase solo si las credenciales no son las de marcador de posición
if (SUPABASE_URL !== 'TU_URL_DE_SUPABASE' && SUPABASE_KEY !== 'TU_ANON_KEY_DE_SUPABASE') {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase configurado correctamente.");
    } catch (e) {
        console.error("Error al inicializar Supabase:", e);
    }
} else {
    console.warn("Supabase no está configurado. El bot funcionará en modo local y no guardará datos permanentemente.");
}

let conocimiento = "";
let conversaciones = JSON.parse(localStorage.getItem('chatbot_history')) || [];

function saveHistory() {
    localStorage.setItem('chatbot_history', JSON.stringify(conversaciones));
}

// Intentamos cargar el conocimiento local al iniciar
fetch('conocimiento.txt')
    .then(response => {
        if (!response.ok) throw new Error("Error HTTP " + response.status);
        return response.text();
    })
    .then(text => {
        conocimiento = text;
        console.log("Conocimiento cargado exitosamente (" + text.length + " caracteres).");
    })
    .catch(err => {
        console.warn("No se pudo cargar conocimiento.txt localmente.", err);
        conocimiento = "";
    });

document.addEventListener('DOMContentLoaded', () => {
    // Referencias DOM
    const homeView = document.getElementById('home-view');
    const chatView = document.getElementById('chat-view');
    const pillButtons = document.querySelectorAll('.pill-btn');
    const brand = document.querySelector('.brand');
    const chatHistory = document.getElementById('chat-history');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const newChatBtn = document.getElementById('new-chat-btn');
    const historyList = document.getElementById('history-list');

    // Admin views
    const adminView = document.getElementById('admin-view');
    const normalProfile = document.getElementById('normal-profile');
    const adminProfile = document.getElementById('admin-profile');

    // Login view
    const loginView = document.getElementById('login-view');
    const studentLoginView = document.getElementById('student-login-view');
    const profileDropdown = document.getElementById('profile-dropdown');
    const navBtnAdminLogin = document.getElementById('nav-btn-admin-login');
    const navBtnStudentLogin = document.getElementById('nav-btn-student-login');
    const navBtnLogout = document.getElementById('nav-btn-logout');

    // Student Form and Info
    const studentSubmitBtn = document.getElementById('student-submit-btn');
    const studentNameDisplay = document.getElementById('student-name-display');
    const studentNombreInput = document.getElementById('student-nombre');
    const studentEdadInput = document.getElementById('student-edad');
    const studentCursoInput = document.getElementById('student-curso');

    // Admin Form and Info
    const adminSubmitBtn = document.getElementById('admin-submit-btn');
    const adminHeaderNameDisplay = document.getElementById('admin-header-name-display');
    const adminUserInput = document.getElementById('admin-user');
    const adminPassInput = document.getElementById('admin-pass');
    const adminRoleInput = document.getElementById('admin-role');

    // Home Chat
    const homeChatInput = document.getElementById('home-chat-input');
    const homeSendBtn = document.getElementById('home-send-btn');

    // Docente Add View Reference
    const docenteNavAddBtn = document.getElementById('docente-nav-add-btn');
    const docenteAddView = document.getElementById('docente-add-view');
    const addPreguntaInput = document.getElementById('add-pregunta-input');
    const addRespuestaInput = document.getElementById('add-respuesta-input');
    const addPublicarBtn = document.getElementById('add-publicar-btn');
    const addVolverBtn = document.getElementById('add-volver-btn');

    // Docente Edit View Reference
    const docenteNavEditBtn = document.getElementById('docente-nav-edit-btn');
    const docenteEditView = document.getElementById('docente-edit-view');
    const editLoadPreguntasBtn = document.getElementById('edit-load-preguntas-btn');
    const editLoadRespuestasBtn = document.getElementById('edit-load-respuestas-btn');
    const editPreguntasList = document.getElementById('edit-preguntas-list');
    const editRespuestasList = document.getElementById('edit-respuestas-list');
    const editPublicarBtn = document.getElementById('edit-publicar-btn');
    const editVolverBtn = document.getElementById('edit-volver-btn');

    // Docente Delete View Reference
    const docenteNavDeleteBtn = document.getElementById('docente-nav-delete-btn');
    const docenteDeleteView = document.getElementById('docente-delete-view');
    const deleteSearchBtn = document.getElementById('delete-search-btn');
    const deleteExecuteBtn = document.getElementById('delete-execute-btn');
    const deleteInfoList = document.getElementById('delete-info-list');
    const deleteVolverBtn = document.getElementById('delete-volver-btn');
    const deleteSaveBtn = document.getElementById('delete-save-btn');

    // Coordinador View Reference
    const coordinadorNavUpdatesBtn = document.getElementById('coordinador-nav-updates-btn');
    const coordinadorUpdatesView = document.getElementById('coordinador-updates-view');
    const updatesVolverBtn = document.getElementById('updates-volver-btn');

    // System Admin Reference
    const adminNavUsersBtn = document.getElementById('admin-nav-users-btn');
    const adminUsersView = document.getElementById('admin-users-view');
    const usersTableBody = document.getElementById('users-table-body');
    const usersAddBtn = document.getElementById('users-add-btn');
    const usersSaveBtn = document.getElementById('users-save-btn');
    const usersVolverBtn = document.getElementById('users-volver-btn');

    // Logout Modal
    const logoutModal = document.getElementById('logout-modal');
    const logoutConfirmBtn = document.getElementById('logout-confirm-btn');
    const logoutCancelBtn = document.getElementById('logout-cancel-btn');

    // Delete Modal Reference
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const noShowDeleteAgain = document.getElementById('no-show-delete-again');
    const btnCancelDelete = document.getElementById('btn-cancel-delete');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    let silenceDeleteWarning = false;

    // Config views
    const configBtn = document.getElementById('config-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');

    // Toggles
    const toggleTheme = document.getElementById('toggle-theme');
    const toggleContrast = document.getElementById('toggle-contrast');
    const toggleAnimations = document.getElementById('toggle-animations');

    // Robot Interactivity Reference (Home)
    const homeRobot = document.querySelector('.home-view .bot-avatar');
    const eyeLeft = document.getElementById('eye-left');
    const eyeRight = document.getElementById('eye-right');
    const robotMouth = document.getElementById('robot-mouth');
    const robotHandRight = document.getElementById('robot-hand-right');
    let isRobotGreeting = false;

    // --- CARGAR PREFERENCIAS ---
    const loadPreferences = () => {
        const theme = localStorage.getItem('chatbot_theme') === 'light';
        const contrast = localStorage.getItem('chatbot_contrast') === 'true';
        const animations = localStorage.getItem('chatbot_animations') === 'true';

        toggleTheme.checked = theme;
        toggleContrast.checked = contrast;
        toggleAnimations.checked = animations;

        if (theme) document.body.classList.add('light-theme');
        if (contrast) document.body.classList.add('high-contrast');
        if (animations) document.body.classList.add('no-animations');
    };
    loadPreferences();

    // Guardar Preferencias
    toggleTheme.addEventListener('change', (e) => {
        localStorage.setItem('chatbot_theme', e.target.checked ? 'light' : 'dark');
        document.body.classList.toggle('light-theme', e.target.checked);
    });

    toggleContrast.addEventListener('change', (e) => {
        localStorage.setItem('chatbot_contrast', e.target.checked);
        document.body.classList.toggle('high-contrast', e.target.checked);
    });

    toggleAnimations.addEventListener('change', (e) => {
        localStorage.setItem('chatbot_animations', e.target.checked);
        document.body.classList.toggle('no-animations', e.target.checked);
    });

    // Abrir/Cerrar Modal de Configuración
    if (configBtn) {
        configBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    const hideAllViews = () => {
        if (homeView) homeView.classList.add('hidden');
        if (chatView) chatView.classList.add('hidden');
        if (adminView) adminView.classList.add('hidden');
        if (docenteAddView) docenteAddView.classList.add('hidden');
        if (docenteEditView) docenteEditView.classList.add('hidden');
        if (docenteDeleteView) docenteDeleteView.classList.add('hidden');
        if (coordinadorUpdatesView) coordinadorUpdatesView.classList.add('hidden');
        if (adminUsersView) adminUsersView.classList.add('hidden');
        if (loginView) loginView.classList.add('hidden');
        if (studentLoginView) studentLoginView.classList.add('hidden');
    };

    // --- SESION GLOBAL (Estudiante / Docente) ---
    let studentUser = JSON.parse(localStorage.getItem('student_session'));
    let adminUser = JSON.parse(localStorage.getItem('admin_session'));

    const updateAuthUI = () => {
        const isUserLoggedIn = (adminUser && adminUser.id_usuario) || (studentUser && studentUser.id_usuario);

        if (navBtnStudentLogin) navBtnStudentLogin.classList.toggle('hidden', isUserLoggedIn);
        if (navBtnLogout) navBtnLogout.classList.toggle('hidden', !isUserLoggedIn);

        if (normalProfile) normalProfile.classList.add('hidden');
        if (adminProfile) adminProfile.classList.add('hidden');

        if (adminUser && adminUser.id_usuario) {
            if (adminHeaderNameDisplay) adminHeaderNameDisplay.textContent = adminUser.usuario || adminUser.email;
            if (adminProfile) adminProfile.classList.remove('hidden');
            
            // Permisos Granulares
            const isDocente = adminUser.id_rol === 2;
            const isCoordinador = adminUser.id_rol === 4;
            const isAdmin = adminUser.id_rol === 3;

            // El Coordinador y el Admin ven las actualizaciones
            if (coordinadorNavUpdatesBtn) {
                coordinadorNavUpdatesBtn.classList.toggle('hidden', !(isCoordinador || isAdmin));
            }

            // Solo el Admin ve la gestión de usuarios
            if (adminNavUsersBtn) {
                adminNavUsersBtn.classList.toggle('hidden', !isAdmin);
            }

            // Todos (Docente, Coord, Admin) pueden usar las funciones de Docente (Añadir/Editar/Borrar)
            if (docenteNavAddBtn) docenteNavAddBtn.classList.toggle('hidden', !(isDocente || isAdmin));

            if (loginView) loginView.classList.add('hidden');
            if (studentLoginView) studentLoginView.classList.add('hidden');
        } else if (studentUser && studentUser.nombre) {
            if (studentNameDisplay) {
                studentNameDisplay.textContent = studentUser.nombre;
                studentNameDisplay.classList.remove('hidden');
            }
            if (normalProfile) normalProfile.classList.remove('hidden');
        } else {
            if (studentNameDisplay) studentNameDisplay.classList.add('hidden');
            if (normalProfile) normalProfile.classList.remove('hidden');
        }
    };

    // Al iniciar, chequeamos
    updateAuthUI();

    if (studentSubmitBtn) {
        studentSubmitBtn.addEventListener('click', async () => {
            const nombre = studentNombreInput.value.trim();
            const grado = studentCursoInput.value.trim(); // Mapeamos curso -> grado en la DB

            if (nombre && grado) {
                try {
                    // Acción Híbrida: Buscar o Crear Estudiante en SQL
                    let { data: est, error } = await supabaseClient
                        .from('estudiante')
                        .select('*')
                        .eq('nombre', nombre)
                        .maybeSingle();

                    if (!est) {
                        // Si no existe, lo creamos
                        const { data: newEst } = await supabaseClient
                            .from('estudiante')
                            .insert([{ nombre, grado }])
                            .select()
                            .single();
                        est = newEst;

                        // También le creamos un usuario genérico
                        await supabaseClient.from('usuario').insert([{
                            email: `${nombre.toLowerCase().replace(/ /g, '.')}@estudiante.com`,
                            password: 'estudiante123',
                            id_rol: 1, 
                            id_estudiante: est.id_estudiante
                        }]);
                    }

                    // Obtenemos el id_usuario vinculado
                    const { data: userLink } = await supabaseClient
                        .from('usuario')
                        .select('id_usuario')
                        .eq('id_estudiante', est.id_estudiante)
                        .single();

                    studentUser = { ...est, id_usuario: userLink.id_usuario };
                    localStorage.setItem('student_session', JSON.stringify(studentUser));
                    localStorage.removeItem('admin_session');
                    adminUser = null;

                    updateAuthUI();
                    
                    // Limpiar y entrar
                    studentNombreInput.value = '';
                    studentCursoInput.value = '';
                    studentLoginView.classList.add('hidden');
                    homeView.classList.remove('hidden');

                } catch (err) {
                    console.error("Error al ingresar estudiante:", err);
                    alert("Hubo un error al conectar con la base de datos escolar.");
                }
            }
        });
    }

    if (adminSubmitBtn) {
        adminSubmitBtn.addEventListener('click', async () => {
            const email = adminUserInput.value.trim();
            const password = adminPassInput.value.trim();

            if (email && password) {
                try {
                    // Validación real en Supabase (Estandarizado a minúsculas)
                    const response = await supabaseClient
                        .from('usuario')
                        .select('*')
                        .eq('email', email)
                        .eq('password', password)
                        .maybeSingle();

                    if (response.error) {
                        console.error("Error técnico:", response.error);
                        alert("Error de conexión: " + response.error.message);
                        return;
                    }

                    const usuario = response.data;

                    if (!usuario) {
                        alert("Correo o contraseña incorrectos.");
                        return;
                    }

                    // Buscamos su rol
                    const { data: rolData } = await supabaseClient
                        .from('rol')
                        .select('nombre_rol')
                        .eq('id_rol', usuario.id_rol)
                        .single();

                    adminUser = { 
                        email: usuario.email, 
                        usuario: usuario.email.split('@')[0], 
                        id_rol: usuario.id_rol,
                        id_usuario: usuario.id_usuario,
                        rol: rolData ? rolData.nombre_rol : "Administrador" 
                    };

                    localStorage.setItem('admin_session', JSON.stringify(adminUser));
                    localStorage.removeItem('student_session');
                    studentUser = null;

                    // Limpiar form
                    adminUserInput.value = '';
                    adminPassInput.value = '';
                    if (adminRoleInput) adminRoleInput.value = '';

                    updateAuthUI();
                    hideAllViews();
                    homeView.classList.remove('hidden');

                } catch (err) {
                    console.error("Error de login admin:", err);
                    alert("Error crítico de servidor.");
                }
            }
        });
    }

    if (navBtnLogout) {
        navBtnLogout.addEventListener('click', () => {
            profileDropdown.classList.add('hidden');
            logoutModal.classList.remove('hidden');
        });
    }

    if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', () => {
            logoutModal.classList.add('hidden');
        });
    }

    if (logoutConfirmBtn) {
        logoutConfirmBtn.addEventListener('click', () => {
            localStorage.removeItem('student_session');
            localStorage.removeItem('admin_session');
            studentUser = null;
            adminUser = null;

            updateAuthUI();
            logoutModal.classList.add('hidden');

            // Borrar chats si cierra sesión
            localStorage.removeItem('chatbot_history');
            conversaciones = [];
            currentChatId = null;
            renderHistory();
            chatHistory.innerHTML = '';

            hideAllViews();
            homeView.classList.remove('hidden');
        });
    }

    // --- NAVEGACION DOCENTE ---
    if (docenteNavAddBtn) {
        docenteNavAddBtn.addEventListener('click', () => {
            adminView.classList.add('hidden');
            docenteAddView.classList.remove('hidden');
        });
    }

    if (docenteNavEditBtn) {
        docenteNavEditBtn.addEventListener('click', () => {
            adminView.classList.add('hidden');
            docenteEditView.classList.remove('hidden');
            // Reset listas al entrar
            editPreguntasList.innerHTML = '<p class="empty-list-msg">Haz clic en el botón rojo para buscar...</p>';
            editRespuestasList.innerHTML = '<p class="empty-list-msg">Haz clic en el botón amarillo...</p>';
        });
    }

    if (docenteNavDeleteBtn) {
        docenteNavDeleteBtn.addEventListener('click', () => {
            adminView.classList.add('hidden');
            docenteDeleteView.classList.remove('hidden');
            deleteInfoList.innerHTML = '<p class="empty-list-msg">Haz clic en "Buscar información" para comenzar...</p>';
            deleteExecuteBtn.classList.add('hidden');
        });
    }

    if (coordinadorNavUpdatesBtn) {
        coordinadorNavUpdatesBtn.addEventListener('click', () => {
            adminView.classList.add('hidden');
            coordinadorUpdatesView.classList.remove('hidden');
        });
    }

    if (addVolverBtn) {
        addVolverBtn.addEventListener('click', () => {
            docenteAddView.classList.add('hidden');
            adminView.classList.remove('hidden');
        });
    }

    if (editVolverBtn) {
        editVolverBtn.addEventListener('click', () => {
            docenteEditView.classList.add('hidden');
            adminView.classList.remove('hidden');
        });
    }

    if (deleteVolverBtn) {
        deleteVolverBtn.addEventListener('click', () => {
            docenteDeleteView.classList.add('hidden');
            adminView.classList.remove('hidden');
        });
    }

    if (updatesVolverBtn) {
        updatesVolverBtn.addEventListener('click', () => {
            coordinadorUpdatesView.classList.add('hidden');
            adminView.classList.remove('hidden');
        });
    }

    if (adminNavUsersBtn) {
        adminNavUsersBtn.addEventListener('click', () => {
            adminView.classList.add('hidden');
            adminUsersView.classList.remove('hidden');
            renderUsersTable();
        });
    }

    if (usersVolverBtn) {
        usersVolverBtn.addEventListener('click', () => {
            adminUsersView.classList.add('hidden');
            adminView.classList.remove('hidden');
        });
    }

    // --- LOGICA DE GESTION DE USUARIOS (Sincronizada con SQL) ---
    const fetchUsersFromDB = async () => {
        if (!supabaseClient) return [];
        // Traemos solo personal (roles 2 y 3)
        const { data, error } = await supabaseClient
            .from('usuario')
            .select('*, rol(nombre_rol)')
            .neq('id_rol', 1); // Excluimos estudiantes de este panel
        
        if (error) {
            console.error("Error al cargar usuarios:", error);
            return [];
        }
        return data;
    };

    const renderUsersTable = async () => {
        const users = await fetchUsersFromDB();
        usersTableBody.innerHTML = '';

        users.forEach((u) => {
            const row = document.createElement('tr');
            row.className = 'user-row';

            row.innerHTML = `
                <td class="col-user">${u.email}</td>
                <td class="col-pass">${u.password}</td>
                <td class="col-rol">${u.rol ? u.rol.nombre_rol : 'Sin Rol'}</td>
                <td class="col-actions">
                    <div class="user-actions">
                        <button class="edit-icon-btn pencil" title="Editar"><i class="ph ph-pencil-simple"></i></button>
                        <button class="edit-icon-btn trash" title="Eliminar"><i class="ph ph-trash"></i></button>
                    </div>
                </td>
            `;

            // Lógica de Edición Inline (Sincronizada)
            const pencil = row.querySelector('.pencil');
            pencil.onclick = () => {
                row.innerHTML = `
                    <td><input type="text" class="user-inline-input" value="${u.email}"></td>
                    <td><input type="text" class="user-inline-input" value="${u.password}" id="edit-pass-${u.id_usuario}"></td>
                    <td>
                        <select class="user-inline-select">
                            <option value="2" ${u.id_rol === 2 ? 'selected' : ''}>Docente</option>
                            <option value="4" ${u.id_rol === 4 ? 'selected' : ''}>Coordinador</option>
                            <option value="3" ${u.id_rol === 3 ? 'selected' : ''}>Administrador</option>
                        </select>
                    </td>
                    <td>
                        <button class="edit-icon-btn pencil save-row-btn" title="Confirmar"><i class="ph ph-check"></i></button>
                    </td>
                `;

                const saveBtn = row.querySelector('.save-row-btn');
                saveBtn.onclick = async () => {
                    const newEmail = row.querySelector('input').value;
                    const newPass = document.getElementById(`edit-pass-${u.id_usuario}`).value;
                    const newRol = row.querySelector('select').value;

                    const updateData = { email: newEmail, id_rol: parseInt(newRol) };
                    if (newPass) updateData.password = newPass;

                    const { error } = await supabaseClient
                        .from('usuario')
                        .update(updateData)
                        .eq('id_usuario', u.id_usuario);

                    if (!error) {
                        alert("Usuario actualizado en la nube.");
                        renderUsersTable();
                    } else {
                        alert("Error al actualizar: " + error.message);
                    }
                };
            };

            const trash = row.querySelector('.trash');
            trash.onclick = async () => {
                if (confirm(`¿Eliminar al usuario ${u.email}?`)) {
                    const { error } = await supabaseClient
                        .from('usuario')
                        .delete()
                        .eq('id_usuario', u.id_usuario);
                    
                    if (!error) {
                        renderUsersTable();
                    }
                }
            };

            usersTableBody.appendChild(row);
        });
    };

    if (usersAddBtn) {
        usersAddBtn.addEventListener('click', async () => {
            // Añadir usuario genérico a SQL
            const { data, error } = await supabaseClient
                .from('usuario')
                .insert([{ email: 'nuevo@escuela.com', password: '123', id_rol: 2 }])
                .select();
            
            if (!error) {
                renderUsersTable();
                alert("Nuevo usuario creado. Por favor edita sus datos.");
            }
        });
    }

    if (usersSaveBtn) {
        usersSaveBtn.addEventListener('click', () => {
            localStorage.setItem('system_users', JSON.stringify(localUsers));
            alert("¡Base de datos de usuarios actualizada con éxito!");
        });
    }

    // --- LOGICA DE ELIMINACION MASIVA ---
    let localDeleteKnowledge = [];
    let selectedIndices = new Set();

    const renderDeleteList = () => {
        if (localDeleteKnowledge.length === 0) {
            deleteInfoList.innerHTML = '<p class="empty-list-msg">No hay información para mostrar o ya fue eliminada.</p>';
            deleteExecuteBtn.classList.add('hidden');
            return;
        }

        deleteInfoList.innerHTML = '';
        deleteExecuteBtn.classList.remove('hidden');

        localDeleteKnowledge.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'delete-item';

            const checkbox = document.createElement('div');
            checkbox.className = 'custom-checkbox';
            if (selectedIndices.has(index)) checkbox.classList.add('checked');
            checkbox.innerHTML = '<i class="ph-bold ph-check"></i>';

            const textContent = document.createElement('div');
            textContent.className = 'delete-item-text';
            textContent.innerHTML = `
                <div><strong>P:</strong> ${item.pregunta}</div>
                <div><strong>R:</strong> ${item.respuesta}</div>
                <span class="delete-item-info">Fuente: Conocimiento Cargado por Docente</span>
            `;

            row.addEventListener('click', () => {
                if (selectedIndices.has(index)) {
                    selectedIndices.delete(index);
                    checkbox.classList.remove('checked');
                } else {
                    selectedIndices.add(index);
                    checkbox.classList.add('checked');
                }
            });

            row.appendChild(checkbox);
            row.appendChild(textContent);
            deleteInfoList.appendChild(row);
        });
    };

    if (deleteSearchBtn) {
        deleteSearchBtn.addEventListener('click', () => {
            localDeleteKnowledge = JSON.parse(localStorage.getItem('added_knowledge')) || [];
            selectedIndices.clear();
            renderDeleteList();
        });
    }

    if (deleteExecuteBtn) {
        deleteExecuteBtn.addEventListener('click', () => {
            if (selectedIndices.size === 0) {
                alert("Por favor selecciona al menos un elemento para eliminar.");
                return;
            }

            if (confirm(`¿Estás seguro de que deseas eliminar estos ${selectedIndices.size} elementos de la memoria?`)) {
                // Filtrar los que no están seleccionados
                localDeleteKnowledge = localDeleteKnowledge.filter((_, index) => !selectedIndices.has(index));
                selectedIndices.clear();
                renderDeleteList();
            }
        });
    }

    if (deleteSaveBtn) {
        deleteSaveBtn.addEventListener('click', () => {
            localStorage.setItem('added_knowledge', JSON.stringify(localDeleteKnowledge));
            alert("¡La base de conocimientos ha sido actualizada y guardada!");
        });
    }

    // --- LOGICA DE EDICION ---
    let localEditedKnowledge = [];

    const renderEditList = (type) => {
        const container = type === 'pregunta' ? editPreguntasList : editRespuestasList;

        if (localEditedKnowledge.length === 0) {
            container.innerHTML = '<p class="empty-list-msg">No hay contenido cargado para editar.</p>';
            return;
        }

        container.innerHTML = '';
        localEditedKnowledge.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'edit-row';

            const textSpan = document.createElement('span');
            textSpan.className = 'edit-text';
            textSpan.textContent = type === 'pregunta' ? item.pregunta : item.respuesta;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'edit-row-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-icon-btn pencil';
            editBtn.innerHTML = '<i class="ph-bold ph-pencil-simple"></i>';

            const deleteRowBtn = document.createElement('button');
            deleteRowBtn.className = 'edit-icon-btn trash';
            deleteRowBtn.innerHTML = '<i class="ph-bold ph-trash"></i>';

            editBtn.addEventListener('click', () => {
                const currentText = textSpan.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'edit-inline-input';
                input.value = currentText;

                row.replaceChild(input, textSpan);
                input.focus();

                const saveInline = () => {
                    const newValue = input.value.trim();
                    if (newValue) {
                        textSpan.textContent = newValue;
                        // Actualizamos en nuestro array temporal
                        if (type === 'pregunta') {
                            localEditedKnowledge[index].pregunta = newValue;
                        } else {
                            localEditedKnowledge[index].respuesta = newValue;
                        }
                    }
                    row.replaceChild(textSpan, input);
                };

                input.addEventListener('blur', saveInline);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') saveInline();
                });
            });

            deleteRowBtn.addEventListener('click', () => {
                const doDelete = () => {
                    localEditedKnowledge.splice(index, 1);
                    renderEditList(type);
                };

                if (silenceDeleteWarning) {
                    doDelete();
                } else {
                    deleteConfirmModal.classList.remove('hidden');

                    // Manejadores temporales para este item
                    const onConfirm = () => {
                        if (noShowDeleteAgain.checked) silenceDeleteWarning = true;
                        deleteConfirmModal.classList.add('hidden');
                        doDelete();
                        cleanup();
                    };
                    const onCancel = () => {
                        deleteConfirmModal.classList.add('hidden');
                        cleanup();
                    };
                    const cleanup = () => {
                        btnConfirmDelete.removeEventListener('click', onConfirm);
                        btnCancelDelete.removeEventListener('click', onCancel);
                    };

                    btnConfirmDelete.addEventListener('click', onConfirm);
                    btnCancelDelete.addEventListener('click', onCancel);
                }
            });

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteRowBtn);
            row.appendChild(textSpan);
            row.appendChild(actionsDiv);
            container.appendChild(row);
        });
    };

    if (editLoadPreguntasBtn) {
        editLoadPreguntasBtn.addEventListener('click', () => {
            localEditedKnowledge = JSON.parse(localStorage.getItem('added_knowledge')) || [];
            renderEditList('pregunta');
        });
    }

    if (editLoadRespuestasBtn) {
        editLoadRespuestasBtn.addEventListener('click', () => {
            localEditedKnowledge = JSON.parse(localStorage.getItem('added_knowledge')) || [];
            renderEditList('respuesta');
        });
    }

    if (editPublicarBtn) {
        editPublicarBtn.addEventListener('click', () => {
            if (localEditedKnowledge.length > 0) {
                localStorage.setItem('added_knowledge', JSON.stringify(localEditedKnowledge));
                alert("¡Cambios guardados globalmente con éxito!");
            } else {
                alert("No hay cambios que guardar.");
            }
        });
    }

    if (addPublicarBtn) {
        addPublicarBtn.addEventListener('click', () => {
            const preg = addPreguntaInput.value.trim();
            const resp = addRespuestaInput.value.trim();

            if (!preg || !resp) {
                alert("Por favor completa ambos campos antes de publicar.");
                return;
            }

            // Guardar en LocalStorage
            let addedKnowledge = JSON.parse(localStorage.getItem('added_knowledge')) || [];
            addedKnowledge.push({ pregunta: preg, respuesta: resp });
            localStorage.setItem('added_knowledge', JSON.stringify(addedKnowledge));

            // Feedback visual
            alert("¡Pregunta y respuesta publicadas con éxito! Ahora el bot las recordará.");

            // Limpiar y volver
            addPreguntaInput.value = '';
            addRespuestaInput.value = '';
            addVolverBtn.click();
        });
    }

    // --- SISTEMA DE MEMORIA (Supabase - Modelo Relacional) ---
    let historialChat = []; // Usaremos 'historialChat' para coincidir con el modelo SQL
    let currentChatId = null;

    // Carga inicial desde Supabase usando la tabla Historial_Chat
    async function loadChatHistoryFromDB() {
        if (!studentUser && !adminUser) return;
        
        const userId = adminUser ? adminUser.id_usuario : (studentUser ? studentUser.id_usuario : null);
        if (!userId) return;

        try {
            const { data, error } = await supabaseClient
                .from('Historial_Chat')
                .select('*')
                .eq('id_usuario', userId)
                .order('fecha', { ascending: true });

            if (error) throw error;
            
            // Convertimos el historial plano de SQL (pregunta/respuesta) al formato de la UI
            historialChat = data || [];
            reconstruirChatUI();
        } catch (err) {
            console.error("Error cargando historial relacional:", err);
        }
    }

    function reconstruirChatUI() {
        if (!chatHistory) return;
        chatHistory.innerHTML = '';
        historialChat.forEach(registro => {
            if (registro.pregunta) appendMessage('user', registro.pregunta);
            if (registro.respuesta) appendMessage('bot', registro.respuesta);
        });
    }

    loadChatHistoryFromDB();

    async function saveExchangeToDB(pregunta, respuesta) {
        const userId = adminUser ? adminUser.id_usuario : (studentUser ? studentUser.id_usuario : null);
        
        try {
            const { data, error } = await supabaseClient
                .from('Historial_Chat')
                .insert([{ 
                    id_usuario: userId,
                    pregunta: pregunta,
                    respuesta: respuesta
                }]);
            
            if (error) throw error;
        } catch (err) {
            console.warn("No se pudo guardar el historial en SQL:", err);
        }
    }

    async function deleteChat(id) {
        conversaciones = conversaciones.filter(c => c.id !== id);
        
        // Guardamos en memoria local de forma segura
        if (typeof saveHistory === 'function') {
            saveHistory();
        } else {
            localStorage.setItem('chatbot_history', JSON.stringify(conversaciones));
        }

        // Si eliminamos el chat actual, volvemos al inicio
        if (currentChatId === id) {
            currentChatId = null;
            chatHistory.innerHTML = '';
            hideAllViews();
            homeView.classList.remove('hidden');
        }
        
        // Sincronizamos la barra lateral
        renderHistory();
    }

    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';
        conversaciones.forEach(chat => {
            const wrapper = document.createElement('div');
            wrapper.className = 'history-item-wrapper';

            const btn = document.createElement('button');
            btn.className = 'nav-btn history-item';

            // Recortar titulo muy largo
            let titulo = chat.titulo;
            if (titulo.length > 20) titulo = titulo.substring(0, 17) + '...';

            btn.innerHTML = `<i class="ph ph-chat-text"></i> <span class="sidebar-text">${titulo}</span>`;
            btn.onclick = () => loadChat(chat.id);

            const optionsBtn = document.createElement('button');
            optionsBtn.className = 'chat-options-btn hidden-action';
            optionsBtn.innerHTML = `<i class="ph ph-dots-three"></i>`;

            const menuDiv = document.createElement('div');
            menuDiv.className = 'chat-options-menu hidden';
            menuDiv.innerHTML = `<button class="delete-option-btn"><i class="ph ph-trash"></i> Eliminar</button>`;

            optionsBtn.onclick = (e) => {
                e.stopPropagation();
                // Ocultamos otros menús
                document.querySelectorAll('.chat-options-menu').forEach(m => {
                    if (m !== menuDiv) m.classList.add('hidden');
                });
                menuDiv.classList.toggle('hidden');
            };

            menuDiv.querySelector('.delete-option-btn').onclick = (e) => {
                e.stopPropagation();
                deleteChat(chat.id);
            };

            wrapper.appendChild(btn);
            wrapper.appendChild(optionsBtn);
            wrapper.appendChild(menuDiv);
            historyList.appendChild(wrapper);
        });
    }

    // Cierra modal de opciones al dar clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.chat-options-btn')) {
            document.querySelectorAll('.chat-options-menu').forEach(m => m.classList.add('hidden'));
        }
    });


    function loadChat(id) {
        currentChatId = id;
        const chat = conversaciones.find(c => c.id === id);

        hideAllViews();
        chatView.classList.remove('hidden');

        // Limpiamos la vista vieja y pintamos sus mensajes
        chatHistory.innerHTML = '';
        if (chat && chat.mensajes) {
            chat.mensajes.forEach(msg => {
                appendMessage(msg.role === 'user' ? 'user' : 'bot', msg.parts[0].text);
            });
        }

        // Cerrar sidebar autómaticamente en móvil si estaba abierto
        if (window.innerWidth < 768) {
            sidebar.classList.remove('expanded');
        }
    }

    async function createNewChat(titulo) {
        const id = Date.now();
        const nuevoChat = {
            id,
            titulo: titulo || "Nueva conversación",
            mensajes: []
        };
        conversaciones.unshift(nuevoChat);
        currentChatId = id;
        
        // Llamada segura a la función global
        if (typeof saveHistory === 'function') {
            saveHistory();
        } else {
            localStorage.setItem('chatbot_history', JSON.stringify(conversaciones));
        }
        
        // Renderizamos la historia para que aparezca en el panel izquierdo
        renderHistory();
    }

    // --- NAVEGACION BÁSICA ---
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            currentChatId = null;

            hideAllViews();
            homeView.classList.remove('hidden');

            if (normalProfile) normalProfile.classList.remove('hidden');
            if (adminProfile) adminProfile.classList.add('hidden');

            chatHistory.innerHTML = '';
            chatInput.value = '';
        });
    }

    // Menú de opciones de perfil
    document.querySelectorAll('.profile-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (profileDropdown) profileDropdown.classList.toggle('hidden');
        });
    });

    // Cerrar menú al hacer click afuera
    document.addEventListener('click', (e) => {
        if (profileDropdown && !profileDropdown.classList.contains('hidden') && !e.target.closest('.profile-container') && !e.target.closest('.profile-dropdown')) {
            profileDropdown.classList.add('hidden');
        }
    });

    // Botones del menú flotante de perfil
    if (navBtnAdminLogin) {
        navBtnAdminLogin.addEventListener('click', () => {
            profileDropdown.classList.add('hidden');

            // Si ya es administrador / docente (rol 2 o 3), ir directamente al panel
            if (adminUser && (adminUser.id_rol === 2 || adminUser.id_rol === 3)) {
                hideAllViews();
                if (adminView) adminView.classList.remove('hidden');
            } else {
                // Si no, mostrar el formulario de login
                homeView.classList.add('hidden');
                chatView.classList.add('hidden');
                if (adminView) adminView.classList.add('hidden');
                if (docenteAddView) docenteAddView.classList.add('hidden');
                if (docenteEditView) docenteEditView.classList.add('hidden');
                if (docenteDeleteView) docenteDeleteView.classList.add('hidden');
                if (coordinadorUpdatesView) coordinadorUpdatesView.classList.add('hidden');
                if (studentLoginView) studentLoginView.classList.add('hidden');
                if (loginView) loginView.classList.remove('hidden');
            }
        });
    }

    if (navBtnStudentLogin) {
        navBtnStudentLogin.addEventListener('click', () => {
            homeView.classList.add('hidden');
            chatView.classList.add('hidden');
            if (adminView) adminView.classList.add('hidden');
            if (docenteAddView) docenteAddView.classList.add('hidden');
            if (docenteEditView) docenteEditView.classList.add('hidden');
            if (docenteDeleteView) docenteDeleteView.classList.add('hidden');
            if (loginView) loginView.classList.add('hidden');
            if (studentLoginView) studentLoginView.classList.remove('hidden');

            if (normalProfile) normalProfile.classList.add('hidden');
            if (adminProfile) adminProfile.classList.add('hidden');
            profileDropdown.classList.add('hidden');
        });
    }

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });

    brand.addEventListener('click', () => {
        if (newChatBtn) newChatBtn.click();
    });

    // Clic en botones gigantes de colores (Opciones sugeridas)
    pillButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.textContent.trim();

            homeView.classList.add('hidden');
            if (loginView) loginView.classList.add('hidden');
            if (studentLoginView) studentLoginView.classList.add('hidden');
            chatView.classList.remove('hidden');
            chatHistory.innerHTML = '';

            // Creamos un chat titulado igual a la opción cliqueada
            await createNewChat(text);
            appendMessage('user', text);

            let chat = conversaciones.find(c => c.id === currentChatId);
            if (chat) {
                chat.mensajes.push({ role: "user", parts: [{ text: text }] });
                saveHistory();
            }

            await getAIResponse(text, chat);
        });
    });

    // Lógica para la barra de chat de la HOME
    if (homeChatInput && homeSendBtn) {
        const handleHomeChat = async () => {
            const text = homeChatInput.value.trim();
            if(!text) return;

            homeChatInput.value = '';
            hideAllViews();
            chatView.classList.remove('hidden');
            
            if (!currentChatId) {
                await createNewChat(text);
            }

            appendMessage('user', text);
            // Guardamos localmente
            let chat = conversaciones.find(c => c.id === currentChatId);
            chat.mensajes.push({ role: "user", parts: [{ text: text }] });
            saveHistory();

            await getAIResponse(text, chat);
        };

        homeSendBtn.addEventListener('click', handleHomeChat);
        homeChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleHomeChat();
        });
    }

    // --- ENVIO Y COMUNICACION IA (Re-vínculo Seguro) ---
    const sendMessage = async () => {
        console.log("Evento sendMessage disparado");
        const text = chatInput.value.trim();
        if (!text) return;

        chatInput.value = '';

        if (!currentChatId) {
            console.log("No habia chat, creando uno...");
            await createNewChat(text);
        }

        appendMessage('user', text);

        let chat = conversaciones.find(c => c.id === currentChatId);
        if (chat) {
            chat.mensajes.push({ role: "user", parts: [{ text: text }] });
            saveHistory();
        }

        console.log("Llamando a getAIResponse...");
        await getAIResponse(text, chat);
    };

    if (sendBtn) {
        sendBtn.onclick = sendMessage;
        console.log("Botón enviar vinculado.");
    }
    if (chatInput) {
        chatInput.onkeypress = (e) => {
            if (e.key === 'Enter') sendMessage();
        };
        console.log("Input de chat vinculado.");
    }

    function appendMessage(sender, text) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper', sender);

        if (sender === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'bot-mini-avatar';
            avatar.innerHTML = `
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(100, 100) scale(0.7)">
                        <!-- Ramitas y Hojas -->
                        <line x1="0" y1="-30" x2="5" y2="-45" stroke="#4a5022" stroke-width="3" stroke-linecap="round" />
                        <path d="M 3 -40 Q -15 -42 -10 -55 Q 0 -55 3 -40" class="dynamic-fill" />
                        <path d="M 5 -45 Q 25 -45 35 -60 Q 25 -65 5 -45" class="dynamic-fill" />
                        
                        <rect x="-55" y="-35" width="110" height="70" rx="25" fill="#F3F4F6" />
                        <rect x="-35" y="-18" width="70" height="42" rx="10" fill="#0a0a0a" />
                        <circle cx="-12" cy="0" r="5" fill="#ffffff" />
                        <circle cx="12" cy="0" r="5" fill="#ffffff" />
                        <path d="M -4 8 Q 0 16 4 8" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" />
                    </g>
                </svg>
            `;
            messageWrapper.appendChild(avatar);
        }

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        if (text) {
            let htmlText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
            messageDiv.innerHTML = htmlText;
        }

        messageWrapper.appendChild(messageDiv);
        chatHistory.appendChild(messageWrapper);

        // Auto-Scroll suave
        requestAnimationFrame(() => {
            setTimeout(() => {
                chatHistory.scrollTo({
                    top: chatHistory.scrollHeight + 1000,
                    behavior: 'smooth'
                });
            }, 50);
        });

        return messageWrapper;
    }

    // --- INTERACTIVIDAD ROBOT SALUDO ---
    const showRobotExclamation = () => {
        const greetings = ["¡Hola!", "¡Qué tal!", "¡Bienvenido!", "¡Gusto verte!", "¡Holi!"];
        const text = greetings[Math.floor(Math.random() * greetings.length)];
        
        const floatingText = document.createElement('div');
        floatingText.className = 'robot-exclamation greeting-bubble';
        floatingText.textContent = text;
        
        const container = document.querySelector('.bot-glow-container');
        if (container) {
            container.appendChild(floatingText);
            setTimeout(() => floatingText.remove(), 1000);
        }
    };

    if (homeRobot) {
        homeRobot.style.cursor = 'pointer';
        let greetingTimeout;

        homeRobot.addEventListener('click', () => {
            if (greetingTimeout) clearTimeout(greetingTimeout);
            showRobotExclamation();

            // Solo saludo con la mano
            if(robotHandRight) robotHandRight.classList.add('waving-hand');

            // Volver a la normalidad automáticamente después de 2 segundos
            greetingTimeout = setTimeout(() => {
                if(robotHandRight) robotHandRight.classList.remove('waving-hand');
                isRobotGreeting = false;
            }, 2000);
            
            isRobotGreeting = true;
        });
    }

    // --- BUSCADOR DE CONTEXTO RELEVANTE ---
    const getRelevantContext = (query, fullText) => {
        if (!fullText) return "No hay conocimiento cargado.";
        
        // Dividimos el documento por 'Unidad de Competencia' o 'Módulo' o 'Página'
        const segments = fullText.split(/(?=Unidad de Competencia \d+:|MÓDULO \d+:|Página \d+)/gi);
        
        const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        
        const scored = segments.map(seg => {
            let score = 0;
            queryWords.forEach(word => {
                const count = (seg.toLowerCase().match(new RegExp(word, 'g')) || []).length;
                score += count;
            });
            return { seg, score };
        });

        // Tomamos los 5 segmentos con más coincidencias
        const topSegments = scored
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(s => s.seg);

        if (topSegments.length === 0) {
            // Si no hay nada específico, enviamos el inicio del documento
            return segments.slice(0, 3).join('\n\n');
        }

        return topSegments.join('\n\n');
    };

    // --- BUSCADOR POR PALABRAS CLAVE (Requerimiento Académico) ---
    async function buscarEnBaseConocimiento(texto) {
        if (!supabaseClient) return null;
        const palabras = texto.toLowerCase().split(' ').filter(p => p.length > 2);
        
        try {
            console.log("Buscando en SQL:", palabras);
            const { data: coincidencias, error } = await supabaseClient
                .from('palabras_clave')
                .select('id_conocimiento')
                .in('palabra', palabras);

            if (error || !coincidencias || coincidencias.length === 0) return null;

            const idCon = coincidencias[0].id_conocimiento;
            const { data: conSQL, error: errC } = await supabaseClient
                .from('conocimiento_bot')
                .select('respuesta')
                .eq('id_conocimiento', idCon)
                .maybeSingle();

            return (errC || !conSQL) ? null : conSQL.respuesta;
        } catch (e) {
            console.warn("Fallo en búsqueda SQL, usando IA:", e);
            return null;
        }
    }

    // --- MOTOR DE MIGRACIÓN: TXT -> SQL ---
    async function migrarTxtASupabase() {
        if (!conocimiento) {
            alert("No hay archivo de conocimiento cargado para migrar.");
            return;
        }

        console.log("Iniciando migración inteligente a SQL...");
        
        try {
            const fragmento = conocimiento.substring(0, 3000);
            const promptMigracion = `Extrae 5 conceptos académicos clave de este texto y devuélvelos estrictamente en formato JSON. 
            El formato debe ser un array de objetos: [{"materia": "nombre", "respuesta": "explicación corta", "keywords": ["palabra1", "palabra2"]}].
            TEXTO: ${fragmento}`;

            const response = await puter.ai.chat(promptMigracion);
            const data = JSON.parse(response.toString().replace(/```json|```/g, ''));

            for (const item of data) {
                let { data: cat } = await supabaseClient.from('categoria').select('id_categoria').eq('nombre_materia', item.materia).maybeSingle();
                if (!cat) {
                    const { data: newCat } = await supabaseClient.from('categoria').insert([{ nombre_materia: item.materia }]).select();
                    cat = newCat[0];
                }

                const { data: con } = await supabaseClient.from('conocimiento_bot').insert([
                    { id_categoria: cat.id_categoria, respuesta: item.respuesta }
                ]).select();

                const kwInsert = item.keywords.map(k => ({ id_conocimiento: con[0].id_conocimiento, palabra: k.toLowerCase() }));
                await supabaseClient.from('palabras_clave').insert(kwInsert);
            }
            alert("Migración completada.");
        } catch (err) {
            console.error("Error en migración:", err);
            alert("Error al migrar.");
        }
    }

    // Exponer la función para poder llamarla desde la consola o un botón
    window.migrarConocimiento = migrarTxtASupabase;

    const btnMigrate = document.getElementById('admin-nav-migrate-btn');
    if (btnMigrate) {
        btnMigrate.addEventListener('click', migrarTxtASupabase);
    }

    async function saveExchangeToDB(pregunta, respuesta) {
        if (!supabaseClient) return; // No hacemos nada si no hay DB
        const userID = (studentUser && studentUser.id_usuario) || (adminUser && adminUser.id_usuario);
        if (!userID) {
            console.log("Chat de invitado: No se guarda en la nube por privacidad.");
            return;
        }

        try {
            await supabaseClient.from('historial_chat').insert([
                {
                    id_usuario: userID,
                    pregunta: pregunta,
                    respuesta: respuesta
                }
            ]);
        } catch (err) {
            console.error("Error al guardar historial:", err);
        }
    }

    async function getAIResponse(userText, chat) {
        // Mostramos feedback visual inicial
        const loadingMsg = appendMessage('bot', '<span class="typing">Analizando pregunta en base de datos...</span>');

        // PASO 1: Intentar buscar en la Base de Datos SQL (Solo si está configurado)
        let respuestaSQL = null;
        if (supabaseClient) {
            respuestaSQL = await buscarEnBaseConocimiento(userText);
        }
        
        if (respuestaSQL) {
            chatHistory.removeChild(loadingMsg);
            appendMessage('bot', respuestaSQL);
            
            if (chat) {
                chat.mensajes.push({ role: "model", parts: [{ text: respuestaSQL }] });
                saveHistory();
            }

            await saveExchangeToDB(userText, respuestaSQL);
            return; // Detenemos aquí si SQL fue suficiente
        }

        // PASO 2: Si no está en SQL, usamos la IA como respaldo
        // Actualizamos mensaje
        const typingSpan = loadingMsg.querySelector('.typing');
        if (typingSpan) typingSpan.textContent = "Consultando con Puter AI...";

        // Optimización: Solo enviamos el contexto realmente necesario del PDF
        const relevantConocimiento = getRelevantContext(userText, conocimiento);

        // Cargamos conocimiento extra del docente
        const addedKnowledge = JSON.parse(localStorage.getItem('added_knowledge')) || [];
        let extraText = "";
        addedKnowledge.forEach(item => {
            if (userText.toLowerCase().includes(item.pregunta.toLowerCase())) {
                extraText += `PAGR REGISTRADA POR DOCENTE: Pregunta: ${item.pregunta} -> Respuesta: ${item.respuesta}\n`;
            }
        });

        const baseInstructions = `Eres un bot académico de excelencia. Tienes una personalidad amable, profesional y muy conversacional.
REGLA 1: Si el usuario te saluda o hace plática inicial, respóndele el saludo con naturalidad y amabilidad, y pregúntale en qué le puedes ayudar hoy.
REGLA 2: Para las preguntas académicas o de contenido, debes responder estricta y ÚNICAMENTE usando la información proveída en tu conocimiento base (PDF + extras). NO inventes hechos.
REGLA 3: Si no tienes la información, ofrece temas clave del conocimiento base.

=== CONOCIMIENTO BASE SELECCIONADO (PDF) ===
${relevantConocimiento}
${extraText}
=== FIN CONOCIMIENTO ===`;

        const userContext = studentUser ? `\n\nCONTEXTO DEL USUARIO: El estudiante se llama ${studentUser.nombre}. Llámalo por su nombre.` : "";

        try {
            const messages = [{ role: 'system', content: baseInstructions + userContext }];

            // Añadimos el historial previo
            chat.mensajes.forEach(m => {
                messages.push({
                    role: m.role === 'model' ? 'assistant' : 'user',
                    content: m.parts[0].text
                });
            });

            // Llamada con STREAMING para respuesta instantánea (Puter v2)
            const stream = await puter.ai.chat(messages, { 
                stream: true, 
                model: 'gpt-4o-mini' // Usamos un modelo más rápido y eficiente
            });

            // Quitamos el "cargando" y creamos el contenedor real
            chatHistory.removeChild(loadingMsg);
            const botMsgWrapper = appendMessage('bot', '');
            const botMsgDiv = botMsgWrapper.querySelector('.message');
            
            let fullText = "";
            for await (const part of stream) {
                if (part.text) {
                    fullText += part.text;
                    // Renderizado progresivo de Markdown básico
                    botMsgDiv.innerHTML = fullText
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\n/g, '<br>');
                    
                    // Solo scrolleamos si estamos cerca del final
                    chatHistory.scrollTop = chatHistory.scrollHeight;
                }
            }

            // Al finalizar el streaming, guardamos el par pregunta/respuesta en SQL
            if (chat) {
                chat.mensajes.push({ role: "model", parts: [{ text: fullText }] });
                saveHistory();

                // NUEVO: Guardar en la tabla relacional Historial_Chat de SQL
                await saveExchangeToDB(userText, fullText);
            }

        } catch (err) {
            console.error(err);
            if (loadingMsg && loadingMsg.parentNode) chatHistory.removeChild(loadingMsg);
            
            const errorMessages = [
                "¡Vaya! Puter AI está tomando un respiro. 🍃 Inténtalo de nuevo.",
                "¡Ups! Los circuitos de Puter se enredaron un poco. 🤖 ¿Me lo repites?",
                "Perdona, me distraje un segundo procesando con Puter. 🧠✨ ¿Reenviamos?",
                "¡Cielos! Un error en el motor Puter. 📡 Inténtalo otra vez.",
                "Parece que un bug se coló en el sistema Puter. 🐛 Inténtamos de nuevo."
            ];
            const randomMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            appendMessage('bot', randomMsg);
            if (chat) {
                chat.mensajes.push({ role: "model", parts: [{ text: randomMsg }] });
                saveHistory();
            }
        }
    }

    renderHistory();
    updateAuthUI();
});
