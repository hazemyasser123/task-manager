// Login

var token;

document.getElementById('loginForm').addEventListener('submit' ,async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const userDetails = {
        email : email,
        password : password
    }

    const response = await fetch('/users/login' , 
        {
        method: 'POST',
        
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(userDetails) })
        if (!response.ok) {
            alert("couldn't Login")
            throw new Error('Network response was not ok');
        }
    
        
        const result = await response.json();
        
        console.log(result.user)
        
        
        token = result.token
        console.log(token)
        
        alert("Login succesfully")
        sessionStorage.setItem('Username' , result.user.name)
        sessionStorage.setItem('UserAvatar' , result.user.avatar)
        localStorage.setItem('Obj' , {
            name :'a7a',
            age: 20
        })
        sessionStorage.setItem('UserToken', token)

        
        location.href = '/tasks.html'
    })
    
