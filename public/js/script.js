document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const age = document.getElementById('age').value;
    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];

    const userDetails = {
        name: username,
        password: password,
        email: email,
        age: age
    };

    const userResponse = await fetch('/users', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails)
    });

    if (!userResponse.ok) {
        alert("User already exists");
        throw new Error('Network response was not ok');
    }

    alert("User added successfully");

    const userResult = await userResponse.json();
    window.token = userResult.token;
    sessionStorage.setItem('UserToken', window.token);

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

    location.href = '/tasks.html';
});



