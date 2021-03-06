'use strict';
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;

const MyEmitter = new EventEmitter();
const util = require('util');
const setImmediatePromise = util.promisify(setImmediate);




describe('Promise Cancel',()=>{
  it('setImmediate test',(done)=>{
    setImmediatePromise('foobar').then((value) => {
      // value === 'foobar' (passing values is optional)
      // This is executed after all I/O callbacks.
      console.log(value);
      done();
    });

// or with async function
    async function timerExample() {
      console.log('Before I/O callbacks');
      setImmediatePromise();
      console.log('After I/O callbacks');
    }
    timerExample();
    timerExample();
    timerExample();
    timerExample();
    timerExample();
    timerExample();
    timerExample();
    timerExample();
    timerExample();
    timerExample();
  });
  it('for loop test',()=>{
    let index;
    for(index = 0; index < 100; index++)
    assert.deepEqual(index,100,'Not Matched index');
  });
  it('Promise initialize test',(done)=>{
    const task = new Promise((resolve, reject)=>{
      let index;
      try{
        for( index = 0; index < 10; index++){
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
          for( index = 0; index < 10; index++){
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
    MyEmitter.emit('reject','cancel task');
    task.then((value)=>{
      console.log('Promise resolved '+value);
      done();
    }).catch((e)=>{
      console.log(e);
      done(e);
    });
  });
  it('setTimeout test',(done)=>{
    new Promise((resolve,reject)=>{
      setTimeout(()=>{
        for(let i =0 ; i <100 ; i++){
          console.log(i);
        }
        resolve();
      },1000)
    }).then(()=>{
      done();
    });

  });
  it('virtual click event And Cancel test',(done)=>{

    let agoTask = {
      target : undefined,
      task:{}
    };
    function createCancleAblePromise() {
      let reject = undefined;
      let isExcuted = false;
      const promise = new Promise((PromiseResolve, PromiseReject)=>{

        reject = (message)=>{
          PromiseReject('cancel Task target is : '+message);
        };
        setTimeout(()=>{
          let index;
          for(index = 0 ; index < 10; index++){
            console.log(index);
          }
          isExcuted = true;
          return PromiseResolve('complete' + index);
        },1000);

      });
      return {
        isExcuted : isExcuted,
        reject : reject,
        promise: promise
      };
    }
    MyEmitter.on('click',(element)=>{
      console.log(element);
      if(agoTask.task.isExcuted){
        // 이전 작업이 실행된 상태 새로운 작업 그냥 생성하면됨
        console.log('실행되고 나서 새로운 작업생성');
        agoTask.target = element;
        agoTask.task = createCancleAblePromise(element);

      }else{
        if(agoTask.target){
          //실행안된 상태로 이전 작업 취소해야함
          console.log('취소할 작업 '+JSON.stringify(agoTask));
          agoTask.task.isExcuted = true;
          agoTask.task.reject('client busy so cancel task '+JSON.stringify(agoTask.target));

          agoTask.target = element;
          agoTask.task = createCancleAblePromise(element);

        }else{
          // 맨 처음 실행시 태스크가 없을 때
          agoTask.target = element;
          agoTask.task = createCancleAblePromise(element);
          console.log('target 없어서 생성된 작업'+JSON.stringify(agoTask));
        }
      }

      agoTask.task.promise
        .then((v)=>{
          console.log(v + JSON.stringify(agoTask));
          done();
        })
        .catch((e)=>{
          console.log(e);
          // done();
        });
    });
    MyEmitter.emit('click','srcElement1');
    console.log('click ----------');
    MyEmitter.emit('click','srcElement2');
  });
  it('virtual click event And Cancel test with fn parameter',(done)=>{

    let agoTask = {
      target : undefined,
      task:{}
    };
    function createCancleAblePromise(fn,element) {
      let reject = undefined;
      let isExcuted = false;
      const promise = new Promise((PromiseResolve, PromiseReject)=>{

        reject = (message)=>{
          PromiseReject('cancel Task target is : '+message);
        };
        fn(element).then((result)=>{
          return PromiseResolve(result);
        }).catch((e)=>{
          return PromiseReject(e);
        });

      });
      return {
        isExcuted : isExcuted,
        reject : reject,
        promise: promise
      };
    }
    const task = (element)=>{
      return new Promise((resolve,reject)=>{
        for(let index =0 ; index<10; index++){
          console.log(index);
        }
        resolve(element);
      });
    };
    MyEmitter.on('click',(element)=>{
      console.log(element);
      if(agoTask.task.isExcuted){
        // 이전 작업이 실행된 상태 새로운 작업 그냥 생성하면됨
        console.log('실행되고 나서 새로운 작업생성');
        agoTask.target = element;
        agoTask.task = createCancleAblePromise(task,element);

      }else{
        if(agoTask.target){
          //실행안된 상태로 이전 작업 취소해야함
          console.log('취소할 작업 '+JSON.stringify(agoTask));
          agoTask.task.isExcuted = true;
          agoTask.task.reject('client busy so cancel task '+JSON.stringify(agoTask.target));

          agoTask.target = element;
          agoTask.task = createCancleAblePromise(task,element);

        }else{
          // 맨 처음 실행시 태스크가 없을 때
          agoTask.target = element;
          agoTask.task = createCancleAblePromise(task,element);
          console.log('target 없어서 생성된 작업'+JSON.stringify(agoTask));
        }
      }

      agoTask.task.promise
        .then((v)=>{
          console.log(v + JSON.stringify(agoTask));
          done();
        })
        .catch((e)=>{
          console.log(e);
          // done();
        });
    });
    MyEmitter.emit('click','srcElement1');
    console.log('click ----------');
    MyEmitter.emit('click','srcElement2');
  });

});