const token = sessionStorage.getItem('UserToken')


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

document.getElementById('taskForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    
    const description = document.getElementById('Description').value;
    const completed = document.getElementById('Completed').value === 'true';

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Replace with actual token
            },
            body: JSON.stringify({
                description,
                completed
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('New Task Added:', data);
            alert('Task added successfully!');
        } else {
            const errorData = await response.json();
            console.error('Error adding task:', errorData);
            alert('Failed to add task.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});

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