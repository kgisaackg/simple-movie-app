//Add movie once button clicked
document.querySelector('#btn-save').addEventListener('click', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;
    const releaseYear = document.querySelector('#releaseYear').value;
    const genre = document.querySelector('#genre').value;
    const id = 0; //find a better way

    //Validation
   
    if(!noError(title, description, releaseYear, genre)){
        const movie = {title, description, releaseYear, genre};
        server.addOnServer(movie);
    
        //Have to come up with a way to refresth after adding
        document.querySelector('.moviesTable').style.visibility = "visible";
        movieUI.clearFormFields();
        location.reload();
    }
});

//Delete Movie button clicked
document.querySelector('.movieList').addEventListener('click', (e) =>{
    movieUI.deleteMovie(e.target);
});

//Edit moive
document.querySelector('.movieList').addEventListener('click', (e) =>{
    movieUI.editMovie(e.target);
});

class movieUI{
    static addToMoviesList(id, title, description, releaseYear, genre) {
        const tableRow = document.createElement('tr');
        const tbody = document.querySelector('.movieList');
        tableRow.innerHTML = `
            <td>${id}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${releaseYear}</td>
            <td>${genre}</td>
            <td><button class="btn-edit">Edit</button></td>
            <td><button class="btn-delete">Delete</button></td>
        `;
        tbody.appendChild(tableRow);
    }

    static deleteMovie(el){
        if(el.classList.contains('btn-delete')){
            const sl = el.parentElement.parentElement;
            const id =  sl.childNodes[1].textContent;

            server.deleteOnServer(id);
            el.parentElement.parentElement.remove();
        };
    }

    static editMovie(el){
        if(el.classList.contains('btn-edit')){
            this.clearErrorMsg();
            const sl = el.parentElement.parentElement;

            //Get the values from the table 
            const id =  sl.childNodes[1].textContent;
            const title = sl.childNodes[3].textContent;
            const description = sl.childNodes[5].textContent;
            const releaseYear = sl.childNodes[7].textContent;
            const genre = sl.childNodes[9].textContent;

            //Show the values on the edit form
            document.querySelector('#title').value = title;
            document.querySelector('#description').value = description;
            document.querySelector('#releaseYear').value = releaseYear;
            document.querySelector('#genre').value = genre;
            this.createEditOptionBtn(sl, id);
        }
    }

    //Create edit option button 
    static createEditOptionBtn(sl, id){
        //Hide the movie list 
        document.querySelector('.moviesTable').style.visibility = "hidden";
        document.querySelector('#btn-save').style.visibility = "hidden";

        //Creation of buttons within the edit option 
        const div = document.createElement('div');
        div.innerHTML = '<button class="cancel">Cancle</button>'
             + '<button class="saveChanges">Save Changes</button>';

        const movieForm = document.querySelector('#movie-form');
        const sendBtn = document.querySelector('#btn-send');
        movieForm.insertBefore(div, sendBtn);

        this.editOptionEvent(div, sl, id);
    }

    //Handle events on the edit option
    static editOptionEvent(div, sl, id){
        document.querySelector('.saveChanges').addEventListener('click', (e) => {
            e.preventDefault();

            const title = document.querySelector('#title').value;
            const description = document.querySelector('#description').value;
            const releaseYear = document.querySelector('#releaseYear').value;
            const genre = document.querySelector('#genre').value;

            if(!noError(title, description, releaseYear, genre)){
                const _data = {title, description, releaseYear, genre};
                server.updateServer(_data, id);
                location.reload();
                selfDistruct(div);
            }
        });

        document.querySelector('.cancel').addEventListener('click', (e) => {
            e.preventDefault();
            this.clearErrorMsg();
            selfDistruct(div);
        });

        //To delete the created edit option buttons
        const selfDistruct = (div) => {
            document.querySelector('.moviesTable').style.visibility = "visible";
            document.querySelector('#btn-save').style.visibility = "visible";
            this.clearFormFields();
            div.remove();
        }
    }

    static showMovies(){
       server.readMovies();
    }

    static clearFormFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#releaseYear').value = '';
        document.querySelector('#genre').value = '';
    }

    static clearErrorMsg(){
        document.querySelector('.titleError').innerText = "";
        document.querySelector('.descriptionError').innerText = "";
        document.querySelector('.releaseYearError').innerText = "";
        document.querySelector('.genreError').innerText = "";
    }
}


class server {
    static readMovies(){
        fetch('http://localhost:3000')
        .then( (res) => res.json())
        .then((movies) => {
            movies.forEach((movie) =>{
                movieUI.addToMoviesList(movie.id, movie.title, movie.description, 
                    movie.releaseYear, movie.genre);
           });
        }).catch((err) => console.log(err));
    }

    static updateServer(movie, id){
        fetch(`http://localhost:3000/${id}`, {
                method: "PUT",
                body: JSON.stringify(movie),
                headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => console.log(json))
        .catch((err) => console.log(err));
    }

    static deleteOnServer(id){
        fetch(`http://localhost:3000/${id}`, {
                method: "DELETE",
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => console.log(json))
            .catch((err) => console.log(err));
    }

    static addOnServer(movie){
        fetch('http://localhost:3000', {
            method: "POST",
            body: JSON.stringify(movie),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => console.log(json));
    }

}

const noError = (title, description, releaseYear, genre) => {

    const titleValue = title.trim();
	const descriptionValue = description.trim();
	const releaseYearValue = releaseYear.trim();
    const  genreValue =  genre.trim();
    
    let error = false;
    if(titleValue === ''){
        document.querySelector('.titleError').innerText = "*Title cannot be empty";
        error = true;
    }else if(titleValue.length > 100){
        document.querySelector('.titleError').innerText = "*Title cannot be have more than 100 letters";
        error = true;
    }else{
        document.querySelector('.titleError').innerText = "";
    }

    if(descriptionValue === ''){
        document.querySelector('.descriptionError').innerText = "*Description cannot be empty";
        error = true;
    }else{
        document.querySelector('.descriptionError').innerText = "";
    }

    if(releaseYearValue === ''){
        document.querySelector('.releaseYearError').innerText = "*Year cannot be empty";
        error = true;
    }else if(releaseYearValue.length > 4){
        document.querySelector('.releaseYearError').innerText = "*Year cannot have more than 4 values";
        error = true;
    }else{
        document.querySelector('.releaseYearError').innerText = "";
    }

    if(genreValue === ''){
        document.querySelector('.genreError').innerText = "*Genre cannot be empty";
        error = true;
    }else if(genreValue.length > 21){
        document.querySelector('.genreError').innerText = "*Genre cannot have more tan 20 letters";
        error = true;
    }else{
        document.querySelector('.genreError').innerText = "";
    }

    return error; 
}

//Once the site is running 
document.addEventListener('DOMContentLoaded', movieUI.showMovies());