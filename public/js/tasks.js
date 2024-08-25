
const token = sessionStorage.getItem('UserToken');
const bar = document.getElementById('hamburgermenu');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

async function fetchAndDisplayAvatar() {
    try {

        const userResponse = await fetch(`/users/me` , {
            method : 'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })

        if(!userResponse.ok){
            throw new Error('Failed to fetch user');
        }
        
        const user = await userResponse.json()

        const response = await fetch(`/users/${user._id}/avatar`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch avatar');
        }

        const avatarBlob = await response.blob();
        const avatarURL = URL.createObjectURL(avatarBlob);

        const logoImage = document.querySelector('#header img');
        logoImage.src = avatarURL; 
    } catch (error) {
        console.error('Error fetching avatar:', error);
    }
}

fetchAndDisplayAvatar()

const tasksArray = [
    {
        description: "Complete the project report",
        completed: true
    },
    {
        description: "Attend team meeting",
        completed: false
    },
    {
        description: "Review pull requests",
        completed: true
    },
    {
        description: "Fix bugs in the codebase",
        completed: false
    }
];


const tasksContainer = document.getElementById('tasksContainer');

function DisplayTasks(tasks) {
    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = ''; 

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'tasks-container';
        taskDiv.id = `task-${task._id}`;

        const descriptionPara = document.createElement('p');
        descriptionPara.innerHTML = `<strong>Description:</strong> ${task.description}`;
        
        const completedPara = document.createElement('p');
        completedPara.innerHTML = `<strong>Completed:</strong> <span>${task.completed}</span>`;
        
        const btnsDiv = document.createElement('div');
        btnsDiv.className = 'btns-dev';

        const completedBtn = document.createElement('button');
        completedBtn.textContent = 'Change completed state';


        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'Deletebtn'

        deleteBtn.addEventListener('click', () => deleteTask(task._id));
        completedBtn.addEventListener('click' , () => UpdateTask(task))
        btnsDiv.appendChild(completedBtn);
        btnsDiv.appendChild(deleteBtn);

        taskDiv.appendChild(descriptionPara);
        taskDiv.appendChild(completedPara);
        taskDiv.appendChild(btnsDiv);

        tasksContainer.appendChild(taskDiv);
    });
}

async function fetchTasks() {
    try {
        const response = await fetch('/tasks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const tasks = await response.json();
        const h2 =document.querySelector('h2')
        h2.style.display = 'none'
        console.log(tasks)
        DisplayTasks(tasks)
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function UpdateTask(task) {
    try {
        console.log('updating')

        if(task.completed === true)
        {
            const userDetails = {
                completed : false
            }
            const response = await fetch(`/tasks/${task._id}` , {
                method : 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetails)
            })
            if(!response.ok){
                throw new Error("Couldn't update the task")
            }
        }
        else{
            const userDetails = {
                completed : true
            }
            const response = await fetch(`/tasks/${task._id}` , {
                method : 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetails)
            })    
            if(!response.ok){
                throw new Error("Couldn't update the task")
            }
        }
        fetchTasks()
        alert('Task has been updated')
    } catch (error) {
        console.error(error)
    }
}

async function deleteTask(taskId) {
    try {
        console.log('del')
        const response = await fetch(`tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete the task');
        }

        document.getElementById(`task-${taskId}`).remove();
    } catch (error) {
        console.error('There was a problem with the delete operation:', error);
    }
}

fetchTasks()

if(bar){
    bar.addEventListener('click' , () => {
        nav.classList.add('active');
    })
}

if(close){
    close.addEventListener('click' , () => {
        nav.classList.remove('active');

    })
}

const Logoutbtn = document.getElementById('Logoutbtn')

Logoutbtn.addEventListener('click' , async ()=> {
    try {
        const response = await fetch('/users/logout' , {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('UserToken')}`
            }
        })
        sessionStorage.setItem('UserToken' , '')
    } catch (error) {
        console.log(error)
    }
})

const LogoutAllbtn = document.getElementById('LogoutAllbtn')

LogoutAllbtn.addEventListener('click' , async ()=> {
    try {
        const response = await fetch('/users/logoutall' , {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('UserToken')}`
            }
        })
        sessionStorage.setItem('UserToken' , '')
    } catch (error) {
        console.log(error)
    }
})

