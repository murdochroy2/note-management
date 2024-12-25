# Instructions

## Deployed Application https://note-management-215x.vercel.app 
* Visit the link https://note-management-215x.vercel.app 
* View the Loom video (Part 1) https://www.loom.com/share/06e030632d7f4c6b8852c80a078f6b2b?sid=80869090-31b4-46a4-93f6-4bef9263a329
* Loom video after issues fixed (Part 2) https://www.loom.com/share/7dfe8bad41594445a76f16322312ad2a?sid=7e890c92-12b1-4d27-9047-8da4c23ba039

## Pre-requisites
1. Node js and Docker must be installed locally

## Local Setup
1. Clone this github repository 
```bash
git clone git@github.com:murdochroy2/note-management.git
```
2. Run the mongodb docker container 
```bash
docker run -d --name mongodb-local -p 27017:27017 -v ~/data/mongodb:/data/db mongo
```
3. Go to the directory server. 
```bash
cd note-management/server
```
4. Rename the `.env.sample` by running 
```bash
mv .env.sample .env
```
5. Run the commands 
```bash
npm install
npm start
```
6. Go to the directory client 
```bash
cd ../client
```
7. Run the commands 
```bash
npm install
npm start
```
8. In your browser, go to the url 
```bash
http://localhost:3000
```
