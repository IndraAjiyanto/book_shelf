
document.addEventListener('DOMContentLoaded',function(){
    const form = document.getElementById('inputBook');
    form.addEventListener('submit',function(event){
        event.preventDefault();
        tambah();
    });

    function tambah(){
        const tittle = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = document.getElementById('inputBookYear').value;
        const complete = document.getElementById('inputBookIsComplete');
        const isComplete = complete.checked;
        const createId = creatId();
        const createBook = createTheBook(createId,tittle,author,year,isComplete);
        book.push(createBook); 
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveBook();
        
    }

    function creatId(){
        return +new Date();
    }

    function createTheBook(id,tittle,author,year,isComplete){
        return{
            id,tittle,author,year : parseInt(year, 10),isComplete
        }
    }




    const search = document.getElementById('searchBook');
    search.addEventListener('submit',function(event){
        event.preventDefault();
       searching();
    });

    const book = [];
const save = [];

function searching(){
    save.splice(0,save.length);
    const valueSearch = document.getElementById('searchBookTitle').value;
        for (let i = 0; i < book.length; i++) {
        if(valueSearch === book[i].tittle){
            save.push(book[i]);
        }else{
            null;
        }
        console.log(i);
    }if(valueSearch === ''){
        return refresh(book);
    }else{
    return value();
}
}

function refresh(book){
    for(const bookElement of book){
        return makeBook(bookElement);
    }
    
}



function value(){
    const uncompletedBook = document.getElementById('incompleteBookshelfList');
    uncompletedBook.innerHTML='';

    const completedBook = document.getElementById('completeBookshelfList');
    completedBook.innerHTML='';
    for(const bookItem of save){
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete == false){
            uncompletedBook.append(bookElement);
        }else{
            completedBook.append(bookElement);
    }
}
}


    const RENDER_EVENT = 'render-todo';
    document.addEventListener(RENDER_EVENT, function(){
        const uncompletedBook = document.getElementById('incompleteBookshelfList');
        uncompletedBook.innerHTML='';

        const completedBook = document.getElementById('completeBookshelfList');
        completedBook.innerHTML='';





        for(const bookItem of book){
            const bookElement = makeBook(bookItem);
            if (bookItem.isComplete == false){
                uncompletedBook.append(bookElement);
            }else{
                completedBook.append(bookElement);
            }
    }
    });

    function makeBook(bookObject){
        const textTitle = document.createElement('h3');
        textTitle.innerText = bookObject.tittle;

        const textAuthor = document.createElement('p');
        textAuthor.innerText = bookObject.author;

        const textYear = document.createElement('p');
        textYear.innerText = bookObject.year;

        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textTitle,textAuthor,textYear);

        const container = document.createElement('article');
        container.classList.add('book_item');
        container.setAttribute('id', `book-${bookObject.id}`);
        const complete = document.createElement('div');
        complete.classList.add('action');
        container.append(textContainer,complete);


        if(bookObject.isComplete == true){
            const undoButton = document.createElement('button');
            undoButton.innerText='kembali';
            undoButton.classList.add('undo-button');
            undoButton.addEventListener('click', function(){
                undoBookCompleted(bookObject.id);
            });

            function undoBookCompleted(bookId){
                const bookTarget = findBook(bookId);
            

            if(bookTarget == null) return;
            bookTarget.isComplete = false;
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveBook();
        }

        function findBook(bookId){
            for(const bookItem of book){
                if (bookItem.id === bookId){
                    return bookItem;
                }
            }
            return null;
        }
       
        complete.append(undoButton);

   
        }else{
            const checkButton = document.createElement('button');
            checkButton.innerText='selesai';
            checkButton.classList.add('check-button');

            checkButton.addEventListener('click', function(){
                addBookCompleted(bookObject.id);
            });

            function addBookCompleted(bookId){
                const bookTarget = findBook(bookId);

                if (bookTarget == null) return;

                bookTarget.isComplete = true;
                document.dispatchEvent(new Event(RENDER_EVENT));
                saveBook();
            }
            function findBook(bookId){
                for(const bookItem of book){
                    if(bookItem.id === bookId){
                        return bookItem;
                    }
                }
                return null;
            }
            complete.append(checkButton);
        }
        const removeButton = document.createElement('button');
        removeButton.innerText='hapus';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click',function(){
            
            const userChoice = confirm("Apakah Anda yakin ingin menghapusnya?")
               if (userChoice) {
                removeBookCompleted(bookObject.id);
                alert("anda menghapusnya");
                  } else {
                      alert("anda tidak jadi menghapusnya");
}
        });

        function removeBookCompleted(bookId){
            const bookTarget = findBookIndex(bookId);
            if (bookTarget === -1) return;
            book.splice(bookTarget,1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveBook();
        }


        function findBookIndex(bookId){
            for (const index in book){
                if(book[index].id === bookId){
                    return index;
                }
            }
            return -1;
        }

        complete.append(removeButton);

        return container;
    }


    function saveBook(){
        if(isStorageExist()){
            const parsed = JSON.stringify(book);
            localStorage.setItem(STORAGE_KEY, parsed);
        }
    }

    const SAVED_EVENT='saved-todo';
    const STORAGE_KEY='TODO_APPS';

    function isStorageExist(){
        if(typeof(Storage)===undefined){
        alert('browser tidak mendukung penyimpanan local storage');
        return false;
    } 
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null){
        for(const books of data ){
            book.push(books);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}
if(isStorageExist()){
    loadDataFromStorage();
}

});