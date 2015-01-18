var express = require('express'),
    router  = express.Router();

var titles = [
        'The Core Model: Designing Inside Out for Better Results',
        'From Empathy to Advocacy',
        'Tweaking the Moral UI',
        'Conference Proposals that Don’t Suck',
        'Planning for Performance',
        'UX for the Enterprise',
        'Cultivating the Next Generation of Web Professionals',
        'The $PATH to Enlightenment',
        'Responsive Images in Practice',
        'Axiomatic CSS and Lobotomized Owls'
    ],

    descriptions = [
        'We’ve all fallen into territorial arguments about what content belongs on a site’s homepage. It’s the most important part of your website, after all—or is it? Ida Aalen shows us how to circumvent these turf wars with the Core Model approach, starting with a workshop to get everyone on the same page about what really counts as important—to your users. By identifying the core elements of your website as a team, you’ll make those smaller decisions about page design and content placement a lot faster, and without getting political about it.',
        'As designers, we’ve devoted considerable attention to the concept of empathy. But how do we ensure that empathy for our users translates into actionable steps that then guide our design decisions and behaviors? Lyle Mullican explores how we can go beyond listening to our users, and start advocating on their behalf.',
        'Even at the most welcoming and trusting of conferences, a code of conduct is a necessity. Codes of conduct let people know that organizers are willing to protect participants and solve problems—a way of improving the user experience for our whole community. Here, Christina Wodtke attests to the inclusive power of codes of conduct—and what we need to do to see them adopted across the industry.',
        'Conference proposals seem simple enough: throw your thoughts into a text form on a website, keep them within the suggested word limit, and hit send with high hopes of winning over organizers. But there’s much more to a successful conference proposal than meets the eye, and Russ Unger is here to walk through the steps involved with getting your germ of an idea into a polished state that will impress any committee.',
        'We should build websites that are not merely responsive, but sustainable, globally accessible, and, well, responsible, as Scott Jehl suggests in his new book, Responsible Responsive Design. Our approaches to responsive websites need to consider ever-changing devices, limited networks, and unexpected contexts. In this excerpt from Chapter 3, Scott discusses page load times and the responsible delivery of code.',
        'Enterprise UX often involves navigating cumbersome processes, ancient technology, and clients skeptical of design’s value. Yet Fortune 500 companies are often the ones most in need of well-designed internal tools. Jordan Koschei takes us through common problems lurking in global organizations—and how we can improve people’s lives by giving internal tools the same attention as consumer interfaces.',
        'One of the most meaningful and lasting ways we can impact the future of the web is through the values and attitudes we instill in the next generation of web workers. Through informal mentoring, classroom outreach, internships, and more, we can offer support and opportunities to those new to digital professions. Georgy Cohen suggests practical ways to connect with students and welcome them wholeheartedly into the web community.',
        'Web designers and developers are often scared of using the command line, but we don’t need to be. It’s actually a simple—and useful—set of tools that can speed up your work and improve your life. One of the most important concepts in the command line is $PATH. Olivier Lacan explains why—and how to get comfortable following the Path in your work.',
        'When we design responsively, our content elegantly and efficiently flows into any device. All of our content, that is, except images. For years, we’ve catered to users with the highest-resolution screens by sending giant images to everyone. No longer. Eric Portis takes us through the new picture element and other attributes to let us mark up multiple, alternate sources. Find out how to use responsive images now: send the best image for each context, cut down on page weight, and speed up performance.',
        'Managing flow content can get unwieldy—too many class selectors can become a specificity headache, nested styling can get redundant, and content editors don’t always understand the presentational markup. Heydon Pickering offers an unexpected option for handling cascading styles more efficiently: a variation on the universal selector.'
    ];

function getRandomArbitrary(min, max) {
    return Math.floor( Math.random() * (max - min) + min );
}

function clipText( text, max ){
    if ( text && text.length > max ){
        text = text.substr( 0, max - 3 ) + '...';
    }

    return text
}

var guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

// --------------------------------------------------

router.get( "/feed*", function( req, res, next ){
    res.setHeader( "Content-Type", "application/json" );
    next();
});

router.get( "/feed", function( req, res ){
    var feed = [],
        now  = Date.now(),
        counter,
        length = counter = titles.length;

    while ( counter-- ){
        feed.push({
            id: guid(),
            title: titles[ getRandomArbitrary( 0, length ) ],
            desc: clipText( descriptions[ getRandomArbitrary( 0, length ) ], 256 ),
            date: ( new Date( now - ( counter * 86400000 ) ) ).toDateString()
        });
    }

    res.end( JSON.stringify( feed ) );
});

router.get( "/feed/last", function( req, res ){
    var length = titles.length;

    res.end( JSON.stringify({
        id: guid(),
        title: titles[ getRandomArbitrary( 0, length ) ],
        desc: clipText( descriptions[ getRandomArbitrary( 0, length ) ], 256 ),
        date: ( new Date ).toDateString()
    }));
});

module.exports = router;
