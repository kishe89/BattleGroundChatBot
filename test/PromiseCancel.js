'use strict';
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;

const MyEmitter = new EventEmitter();



describe('Promise Cancel',()=>{
  it('for loop test',()=>{
    let index;
    for(index = 0; index < 100000; index++){
      console.log(index);
    }
    assert.deepEqual(index,100000,'Not Matched index');
  });
  it('Promise initialize test',(done)=>{
    const task = new Promise((resolve, reject)=>{
      let index;
      try{
        for( index = 0; index < 100000; index++){
          console.log(index);
        }
      }catch(e) {
        reject(e);
      }
      return resolve(index);
    });
    task.then((value)=>{
      console.log('Promise resolved '+value);
      done();
    }).catch((e)=>{
      done(e);
    })
  })
  it('EventEmitter Test',(done)=>{
    MyEmitter.once('newListener',(listener)=>{
      console.log(listener);
    });
    MyEmitter.on('event1',(event)=>{
      console.log(event);
      done()
    });
    MyEmitter.emit('event1','success');
  });
  it('Promise reject handle with EventEmitter-1',(done)=>{
    const task = new Promise((resolve, reject)=>{
      let index;
      const innerEmitter = new EventEmitter();
      MyEmitter.on('reject',(event)=>{
        console.log(event);
        innerEmitter.emit('reject',event);
      });
      const innerTask = new Promise((resolve,reject)=>{
        innerEmitter.on('reject',(event)=>{
          console.log(event);
          return reject(event);
        });
        try{
          for( index = 0; index < 100000; index++){
            console.log(index);
          }
        }catch(e) {
          reject(e);
        }
        return resolve(index);
      });
      innerTask.then((index)=>{
        console.log(index);
        done();
      }).catch((e)=>{
        console.log(e);
      })
    });
    task.then((value)=>{
      console.log('Promise resolved '+value);
      done();
    }).catch((e)=>{
      console.log(e);
      done(e);
    });
    MyEmitter.emit('reject','cancel task');
  });
  it('virtual click event And Cancel test',(done)=>{

    let agoTask = {
      target : '',
      isExcuted : false,
      task : undefined
    };

    MyEmitter.on('click',(element)=>{
      console.log(element);
      const TaskObject = {
        emitter : new EventEmitter(),
        task : function () {
          agoTask.target = element;
          agoTask.task = TaskObject;
          return new Promise((resolve, reject)=>{
            let index;
            this.emitter.on('reject',(event)=>{
              console.log('reject event called with '+event);
              return reject(event);
            });
            try{
              for( index = 0; index < 100; index++){
                console.log(index);
              }
            }catch(e) {
              reject(e);
            }

            return resolve(index);
          });
        }
      };
      if(agoTask.target !== element){
        console.log('come');
        if(!agoTask.isExcuted && agoTask.task !== undefined){
          agoTask.task.emitter.emit('reject',element);
        }
      }
      TaskObject.task().then((value)=>{
        agoTask.isExcuted = true;
        console.log('Promise resolved '+element);
        done();
      }).catch((e)=>{
        agoTask.isExcuted = true;
        console.log('rejected = '+e);
        done(e);
      });
    });
    MyEmitter.emit('click','srcElement1');
    console.log('click ----------');
    MyEmitter.emit('click','srcElement2');
  });
});