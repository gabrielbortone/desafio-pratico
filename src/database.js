import { promises as fs } from 'fs';

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist = function() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  selectTasks(title, description){
    return this.#database['tasks'].find(x=>  
        (title != null && x.title.contains(title)) || 
        (description != null && x.description.contains(description)) || 
        (title == null && description == null)
    );
  }

  selectById(id){
    return this.#database['tasks'].find(x=> x.id == id);
  }

  updateByBody(id, body){
    const task = this.selectById(id);
    const table = "tasks";

    if(task != null){
        try {
            task.title = body.title;
            task.description = body.description;
            task.updated_at = body.updated_at;


            const rowIndex = this.#database[table].findIndex(row => row.id === id);

            if (rowIndex > -1) {
                this.#database[table][rowIndex] = task;
                this.#persist();
            }
            
            return 1;
        }catch(e){
            return 0;
        }
    }

    return 0;
  }

  updateMark(id){
    const task = this.selectById(id);
    const table = "tasks";
    if(task != null){
        try {
            if(task.update_at){
                task.completed_at = null;
            }
            else{
                task.completed_at = Date.now();

            }

            const rowIndex = this.#database[table].findIndex(row => row.id === id)

            if (rowIndex > -1) {
                this.#database[table][rowIndex] = task;
                this.#persist();
            }
            
            return 1;
        }catch(e){
            return 0;
        }
    }

    return 0;
  }

  delete(id){
    this.#database[tasks] = this.#database[tasks].filter(x=> x.id != id);
    this.#persist();
  }

  insert(body){
    if (Array.isArray(this.#database[table])) {
        this.#database["tasks"].push(data)
      } else {
        this.#database[table] = [data]
      }
  
      this.#persist()
  
      return data
  }
}