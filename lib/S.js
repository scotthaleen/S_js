

(function(){
  var root = this,
  S = {},
  AP = Array.prototype,
  slice = AP.slice,
  concat = AP.concat, 
  use = function(arr,fn){
    fn.apply({}, arr);
  };
  
  /**
   * inheritance
   */
  S.inherits = function(child, parent) {
    function tmp () {};
    tmp.prototype = parent.prototype;
    child.superClass_ = parent.prototype;
    child.prototype = new tmp;
    child.prototype.constructor = child;
  };

  /**
   * base calling
   */
  S.base = function($this, opt_methodName, var_args) {
    var caller = arguments.callee.caller;

    if (caller.superClass_) {
      return caller.superClass_.constructor.apply(
        $this, slice.call(arguments, 1));
    }

    var args = slice.call(arguments, 2);
    var foundCaller = false;
    for (var ctor = $this.constructor;
         ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
      if (ctor.prototype[opt_methodName] === caller) {
        foundCaller = true;
      } else if (foundCaller) {
        return ctor.prototype[opt_methodName].apply($this, args);
      }
    }

    if ($this[opt_methodName] === caller) {
      return $this.constructor.prototype[opt_methodName].apply($this, args);
    } else {
      throw Error('invalid method call');
    }
  };

  S.fn = {};
  S.fn.noop = function(){};
  S.fn.partial = function(fn, varargs){
    var args = slice.call(arguments, 1);
    return function(){
      return fn.apply(this, args.concat(slice.call(arguments)));
    };
  };

  S.fn.ident = function(v){ return v; };
  S.fn.True = S.fn.partial(S.fn.ident, true);
  S.fn.False = S.fn.partial(S.fn.ident, false);
  S.fn.This = function(){ return this; };
  S.fn.inc = function(i){ return i+1; };
  S.fn.dec = function(i){ return i-1; };
  S.fn.not = function(fn){ return function() { return !fn.apply(this, arguments); }};

  S.data = {};
  
  S.data.Iterator = function(){};
  S.data.Iterator.prototype = {
    next: function(){ throw Error(' no values'); },
    hasNext: S.fn.False
  };


  S.data.EmptyIterator = function(){};
  S.inherits(S.data.EmptyIterator, S.data.Iterator);

  S.data.ListIterator = function(list){
    this.list_ = list;
  };
  S.inherits(S.data.ListIterator, S.data.Iterator);
  
  use([S.data.ListIterator], function(ListIterator){
    var hasNext = function(){
      return this.list_.tail().isEmpty();
    };
    var next = function(){
      this.list_ = this.list_.tail();
      return this.list_.head();
    };
    ListIterator.prototype.hasNext = hasNext;
    ListIterator.prototype.next = next;    
  });

  S.data.Iterable = function(){};
  S.data.Iterable.prototype.iterator = function(){ throw Error('Unimplemented');};

  S.data.Lists = {};
  
  /* abstract base */
  S.data.Lists.base = function(){}

  /* NonEmptyList */
  S.data.Lists.NonEmptyList = function(head, tail){
    this.head_ = head;
    this.tail_ = tail;
  };
  S.inherits(S.data.Lists.NonEmptyList, S.data.Iterable);

  /** NonEmptyList prototypes */
  use([S.data.Lists.NonEmptyList], function(NonEmptyList){

    /* head */
    var head = function(){ return this.head_; };

    /* tail */
    var tail = function(){ return this.tail_; };

    var iterator = function(){ return S.data.ListIterator(this); };

    /* filter */
    var filter = function(fn){
      if(fn.call(this, this.head())){
        return new NonEmptyList(this.head(), this.tail().filter(fn));
      } else {
        return this.tail().filter(fn);
      }
    };

    /* map */
    var map = function(fn){
      return new NonEmptyList(fn.call(this, this.head()), this.tail().map(fn));
    };


    /* fold */
    var fold = function(fn, seed){
      return this.tail().fold(fn, fn.call(this, seed, this.head()));
    };

    /* foldl */
    var foldl = function(fn, seed){
      var x = seed, xs;
      for(xs=this; !xs.isEmpty(); xs = xs.tail()){
        x = fn.call(this, x).call(this, xs.head());
      }
      return x;
    };

    /* foldr */
    var foldr = function(fn, seed){
      return fn.call(this, this.head(), this.tail().foldr(fn, seed));
    };

    /* dropWhile */
    var dropWhile = function(fn){
      var xs;
      for(xs = this; !xs.isEmpty() && fn.call(this, xs.head()); xs = xs.tail());
      return xs;
    };

    /*  drop */
    var drop = function(n){
      var xs;
      for(xs = this; !xs.isEmpty() && n-->0; xs = xs.tail());
      return xs;
    };

    /* overrides */
    NonEmptyList.prototype.head = head;
    NonEmptyList.prototype.tail = tail;
    NonEmptyList.prototype.iterator = iterator;
    NonEmptyList.prototype.isEmpty = S.fn.False;    
    NonEmptyList.prototype.filter = filter;
    NonEmptyList.prototype.map = map;  
    NonEmptyList.prototype.fold = fold;
    NonEmptyList.prototype.foldl = foldl;
    NonEmptyList.prototype.foldr = foldr;
    NonEmptyList.prototype.dropWhile = dropWhile;
    NonEmptyList.prototype.drop = drop;
    
    /** todo */
    NonEmptyList.prototype.takeWhile = S.noop;
    NonEmptyList.prototype.reverse = S.noop;

    
  });

  /* EmptyList */
  S.data.Lists.EmptyList = function(){};
  S.inherits(S.data.Lists.EmptyList, S.data.Lists.base);

  /** EmptyList.prototypes */
  use([S.data.Lists.EmptyList], function(EmptyList){

    var head = function(){ throw Error('head called on empty list'); };
    var tail = function(){ throw Error('tail called on empty list'); };
    var iterator = function(){ return new S.data.EmptyIterator();};
    var map = function(){ return S.data.Lists.empty(); };
    var fold = function(fn, seed){ return seed; };
    
    /** overrides */
    EmptyList.prototype.head = head;
    EmptyList.prototype.tail = tail;
    EmptyList.prototype.iterator = iterator;
    EmptyList.prototype.isEmpty = S.fn.True;
    EmptyList.prototype.filter = S.fn.This;
    EmptyList.prototype.map = map;
    EmptyList.prototype.fold = fold;
    EmptyList.prototype.foldr = fold /* same as fold */;
  })

  /** lazy singlton */
  S.data.Lists.empty = (function(){
    var instance_ = new S.data.Lists.EmptyList();
    S.data.Lists.empty = S.fn.partial(S.fn.ident, instance_);
    return S.data.Lists.empty();
  });


  S.data.Lists.cons = function(head, tail){
    return new S.data.Lists.NonEmptyList(head, tail);
  };

  S.data.Lists.list = function(varargs) {
    var i=0,l=arguments.length,ls=S.data.Lists.empty();
    for(;i<l;){
      ls=S.data.Lists.cons(arguments[i++],ls);
    }
    return ls;
  };


  /** Stream are not working */
  S.data.Stream = {}
  S.data.Stream.base = function(){};
  S.inherits(S.data.Stream.base, S.data.Iterable);

  use([S.data.Stream.base, S.fn.not], function(Stream, not){
    var head = function(){ return this.head_; };
    var tail = function(){ return this.tail_; };
    var isEmpty = function(){ return this instanceof S.data.Stream.Nil; }
    var isNotEmpty = function(){ return this instanceof S.data.Stream.Cons; }
    var iterator = function(){ return this.itr_; };
    var filter = function(fn){
      var xs = this.dropWhile(not(fn));
      var next = function(){
        var v = itr.next();
        while(!(fn.call(this, v))) v = itr.next();
        return v;
      };
    };

    /** todo broke */
    var map = function(fn){  
      console.log(1)
      if (this.isEmpty()) 
        return S.data.Stream.nil(); 
      else
        return S.data.Stream.cons(fn.call(this, this.head()), this.tail().map(fn));
    };

    /* dropWhile */
    var dropWhile = function(fn){
      var xs;
      for(xs = this; !xs.isEmpty() && fn.call(this, xs.head()); xs = xs.tail());
      return xs;
    };

    /*  drop */
    var drop = function(n){
      var xs;
      for(xs = this; !xs.isEmpty() && n-->0; xs = xs.tail());
      return xs;
    };

    
    Stream.prototype.head = head;
    Stream.prototype.tail = tail;
    Stream.prototype.isEmpty = isEmpty;
    Stream.prototype.isNotEmpty = isNotEmpty;
    Stream.prototype.iterator = iterator;
    Stream.prototype.filter = filter;
    Stream.prototype.map = map;  
    Stream.prototype.dropWhile = dropWhile;
    Stream.prototype.drop = drop;
  });

  S.data.Stream.Nil = function(){};
  S.inherits(S.data.Stream.Nil, S.data.Stream.base);
  S.data.Stream.Nil.prototype.head = function(){ throw Error('head on empty stream'); };
  S.data.Stream.Nil.prototype.tail = function(){ throw Error('tail on empty stream')};

  S.data.Stream.Cons = function(head, stream){
    this.head_ = head;
    this.tail_ = stream;
  };
  S.inherits(S.data.Stream.Cons, S.data.Stream.base);
  
  S.data.Stream.nil = function(){ return new S.data.Stream.Nil(); };

  S.data.Stream.Numbers = function(head, stream){
    this.head_ = head;
  };
  S.inherits(S.data.Stream.Numbers, S.data.Stream.Cons);
  S.data.Stream.Numbers.prototype.tail = function(){
    return new S.data.Stream.Numbers(this.head_+1);
  };


  root.S = S;
}).call(this);

