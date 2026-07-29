// ================================
// PREFERENCES
// ================================

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ================================
// MOBILE MENU
// ================================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");


if(menuBtn){

    menuBtn.addEventListener("click",()=>{

        navLinks.classList.toggle("active");

    });

}



// Close mobile menu after clicking link

document.querySelectorAll(".nav-links a").forEach(link=>{

    link.addEventListener("click",()=>{

        navLinks.classList.remove("active");

    });

});




// ================================
// SCROLL REVEAL ANIMATION (staggered)
// ================================

const animatedElements = document.querySelectorAll(
    "section, .skill-line, .experience-item, .featured-project, .achievement-list > div"
);


// stagger siblings within their own group

["experience-item","achievement-list > div"].forEach(sel=>{

    document.querySelectorAll(sel).forEach((el,i)=>{

        el.style.setProperty("--i", i);

    });

});


const observer = new IntersectionObserver(

    (entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);

            }

        });

    },

    { threshold:0.15 }

);


animatedElements.forEach(element=>{

    element.classList.add("hidden");
    observer.observe(element);

});




// ================================
// NAVBAR SCROLL EFFECT
// ================================

const header = document.querySelector("header");


window.addEventListener("scroll",()=>{

    if(window.scrollY > 40){

        header.classList.add("scrolled");

    } else{

        header.classList.remove("scrolled");

    }

});




// ================================
// ACTIVE SECTION HIGHLIGHT
// ================================

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");


window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 150;

        if(window.scrollY >= sectionTop){

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link=>{

        link.style.color="";

        if(link.getAttribute("href") === "#" + current){

            link.style.color="#2C6975";

        }

    });

});




// ================================
// PROFILE IMAGE TILT EFFECT (subtle)
// ================================

const profileImage = document.querySelector(".hero-image img");


if(profileImage && !prefersReducedMotion){

    profileImage.addEventListener("mousemove",(e)=>{

        const x = (e.offsetX / profileImage.offsetWidth - 0.5) * 8;
        const y = (e.offsetY / profileImage.offsetHeight - 0.5) * 8;

        profileImage.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;

    });

    profileImage.addEventListener("mouseleave",()=>{

        profileImage.style.transform = "rotateY(0deg) rotateX(0deg)";

    });

}




// ================================
// AMBIENT NEURAL NETWORK (hero signature)
// ================================

(function initNetwork(){

    const canvas = document.getElementById("hero-network");

    if(!canvas) return;

    const ctx = canvas.getContext("2d");
    const hero = canvas.closest(".hero");

    let width, height, nodes;

    const DOT_COLOR = "44,105,117";   // rgb of --signal
    const DENSITY = 9000;             // px^2 per node
    const LINK_DIST = 150;

    function resize(){

        width = canvas.width = hero.offsetWidth;
        height = canvas.height = hero.offsetHeight;

        const count = Math.min(70, Math.floor((width * height) / DENSITY));

        nodes = Array.from({length:count}, ()=>({

            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15

        }));

    }

    function step(){

        ctx.clearRect(0,0,width,height);

        nodes.forEach(n=>{

            n.x += n.vx;
            n.y += n.vy;

            if(n.x < 0 || n.x > width) n.vx *= -1;
            if(n.y < 0 || n.y > height) n.vy *= -1;

        });

        for(let i=0;i<nodes.length;i++){

            for(let j=i+1;j<nodes.length;j++){

                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if(dist < LINK_DIST){

                    const alpha = (1 - dist / LINK_DIST) * 0.18;

                    ctx.strokeStyle = `rgba(${DOT_COLOR},${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();

                }

            }

        }

        nodes.forEach(n=>{

            ctx.fillStyle = `rgba(${DOT_COLOR},0.45)`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 1.8, 0, Math.PI*2);
            ctx.fill();

        });

        if(!prefersReducedMotion){

            requestAnimationFrame(step);

        }

    }

    resize();
    step();

    let resizeTimer;

    window.addEventListener("resize",()=>{

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(()=>{

            resize();
            if(prefersReducedMotion) step();

        }, 200);

    });

})();