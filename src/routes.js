import { v4 as uuidv4 } from 'uuid';;
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import {import_csv, readCSV } from './streams_csv.js';

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      const { title, description } = req.query

      const tasks = database.selectTasks(title, description);

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      const { title, description } = req.body

      const task = {
        id: uuidv4(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        update_at: null
      }

      database.insert(task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks/csv'),
    handler:  async (req, res) => {
      try{
        const result_lines =  await readCSV();

        for(let i =0; i < result_lines.length -1; i++) {

          const task = {
            id: uuidv4(),
            title: result_lines[i].title,
            description: result_lines[i].description,
            completed_at: null,
            created_at: Date.now(),
            update_at: null
          }
    
          database.insert(task)
          
        }

        return res.writeHead(201).end()

      }catch(e){

        console.log(e);
        res.writeHead(400).end
      }

    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params
      const body = req.body
      
      database.updateByBody(id, body);
      

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params

      database.delete(id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: async (req, res) => {
      const { id } = req.params

      database.updateMark(id)

      return res.writeHead(200).end()
    }
  }
]