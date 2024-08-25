const token = sessionStorage.getItem('UserToken');
// const user = JSON.parse(sessionStorage.getItem('User')); // Assuming User is stored as a JSON object
const bar = document.getElementById('hamburgermenu');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

// Fetch and display the user's avatar
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
        const ProfileImg = document.getElementById('ProfileImg')
        // const ProfileImg2 = document.getElementById('ProfileImg2')
        const logoImage = document.querySelector('#header img');
        logoImage.src = avatarURL; // Set the fetched avatar as the logo
        ProfileImg.src = avatarURL
        // ProfileImg2.src = avatarURL
    } catch (error) {
        console.error('Error fetching avatar:', error);
    }
}

async function DisplayProfile() {
    const name = document.getElementById('name')
    const age = document.getElementById('age')
    const email =  document.getElementById('email')

    try {
        const response = await fetch('/users/me' , {
            method : 'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })

        if(!response.ok){
            throw new Error("couldn't get your data")
        }
        const user = await response.json();
        name.innerText = user.name
        age.innerText = user.age
        email.innerText = user.email

    } catch (error) {
        console.log(error)
    }
}

fetchAndDisplayAvatar()
DisplayProfile();

const DelBtn = document.getElementById('DelBtn')

DelBtn.addEventListener('click' , async () => {
    try {
        const response = await fetch('/users/deleteme' , {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('UserToken')}`
            }
        })
        sessionStorage.setItem('UserToken' , '')

    } catch (error) {
        console.log(error)
    }
})

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

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    console.log('updating')
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const username = document.getElementById('username').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;
    const age = document.getElementById('Age').value;
    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];

    console.log(username)
    console.log(age)
    console.log(email)
    console.log(password)
    let userDetails={}
    if(username){
        userDetails = {
            name : username
        }
    }
    if(email){
        userDetails = {
            ...userDetails,
            email : email
        }
    }
    if(password){
        userDetails = {
            ...userDetails,
            password : password
        }
    }
    if(age){
        userDetails = {
            ...userDetails,
            age : age
        }
    }
console.log(userDetails)
    
   
    const userResponse = await fetch('/users/updateme', {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails)
    });

    if (!userResponse.ok) {
        alert("User already exists");
        throw new Error('Network response was not ok');
    }

    alert("User updated successfully");

    const userResult = await userResponse.json();

    console.log(file)
    if (file) {
        const reader = new FileReader();

        reader.onload = async function(e) {
            const buffer = new Uint8Array(e.target.result);

            const formData = new FormData();
            formData.append('avatar', new Blob([buffer]), file.name);

            const imageResponse = await fetch('/users/me/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('UserToken')}`
                },
                body: formData
            });

            if (!imageResponse.ok) {
                alert("Failed to upload image");
                throw new Error('Network response was not ok');
            }

            const imageResult = await imageResponse.json();
            console.log(imageResult.msg); 
        };

        reader.readAsArrayBuffer(file);
    }
    setTimeout(() => {
        
        fetchAndDisplayAvatar()
    }, 1000);
    DisplayProfile();
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

