import {Events} from '../controllers/EventController';

// Wraps around a list
class ObserverList{
  // eventNames: {addEvent: str, removeEvent: str}
  constructor(eventArgs){
    this.items = [];

    this._registerEventHandlers(eventArgs);
  }

  _registerEventHandlers(eventArgs){
    /* Have to use .bind(this) to bind 'this' keyword
        to the instance or else it'll be undefined */
    Events.subscribe(eventArgs.addEvent, this.add.bind(this));
    Events.subscribe(eventArgs.removeEvent, this.removeAtIndex.bind(this));

    if (eventArgs.editEvent){
      Events.subscribe(eventArgs.editEvent, this.editAtIndex.bind(this));
    }

    if (eventArgs.editFirstEvent){
      Events.subscribe(eventArgs.editFirstEvent, this.editFirst.bind(this));
    }

    if (eventArgs.changeListEvent){
      Events.subscribe(eventArgs.changeListEvent, this.setList.bind(this));
    }

    if (eventArgs.removeFirstEvent){
      Events.subscribe(eventArgs.removeFirstEvent, this.removeFirst.bind(this));
    }
  }

  add(item){
    this.items.push(item);
  }

  removeFirst(testFunc){
    for (let i = 0; i < this.items.length; i++){
      if (testFunc(this.items[i])){
        this.removeAtIndex(i);
        return;
      }
    }
  }

  removeAtIndex(index){
    this.items.splice(index, 1);
  }

  getList(){
    return this.items;
  }

  editAtIndex(args){
    const index = args.index;
    const modifyFunc = args.modifyFunc; // modifyFunc must return the modified element
    this.items[index] = modifyFunc(this.items[index]);
  }

  editFirst(args){
    const matchFunc = args.matchFunc;
    const modifyFunc = args.modifyFunc;
    for (let i = 0; i < this.items.length; i++){
      if (matchFunc(this.items[i])){
        this.items[i] = modifyFunc(this.items[i]);
        return;
      }
    }
  }

  setList(newList){
    this.items = newList;
  }

  printList(){
    console.log(this.items);
  }
}

export {ObserverList};
