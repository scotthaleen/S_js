S.js
====

This library is using a prototypal inheritance approach
to achieve some of the similar functional programming 
styles similar to scala/functional java

```javascript

    S.data.Lists.list(1,2,3,4)    
          .map(function(n){ return n*n; })
          .filter(function(n){ return n > 10; })
          .fold(function(a,b){ return a+b; }, 0);
   //=>16
```

Much of the implementation is a mesh of ideas and functions from 

- [https://code.google.com/p/totallylazy/](https://code.google.com/p/totallylazy/)
- [http://functionaljava.org/](http://functionaljava.org/)
- [https://developers.google.com/closure/library/](https://developers.google.com/closure/library/)
- [http://underscorejs.org/](http://underscorejs.org/)

And the book [Functional Java](http://www.amazon.com/Functional-Programming-Java-Developers-Concurrency/dp/1449311032 "Functional Java")



## Testing


testing is run by using python to run a webserver from the project base with [jasmine](https://jasmine.github.io/)

```
python -m SimpleHTTPServer
```

[http://localhost:8000/SpecRunner.html](http://localhost:8000/SpecRunner.html)


### TODO

Streams 
