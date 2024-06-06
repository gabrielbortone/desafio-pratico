import { v4 as uuidv4 } from 'uuid';
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { parse } from 'csv-parse';
import fs from 'node:fs';
import file from 'express-fileupload';

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
    handler: async (req, res) => {
      try{
        const parser = req.pipe(
          parse()
        );
        let count = 1;
        process.stdout.write('start\n');
        for await (const record of parser) {
          process.stdout.write(`${count++} ${record.join(',')}\n`);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
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