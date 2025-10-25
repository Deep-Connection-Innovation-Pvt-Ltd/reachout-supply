import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote} from 'lucide-react';
import saniaImg from '@/assets/sania.png';
import sumbulImg from '@/assets/sumbul.png';
import ratneshImg from '@/assets/ratnesh.webp';
import divyaImg from '@/assets/divya.webp';
import sakshiImg from '@/assets/sakshi.webp';
import krishnaImg from '@/assets/krishna.jpg';

const testimonials = [

  {
    name: "Sumbul",
    role: "Rehabilitation Psychologist",
    text: "psychology is one of those fields where you get better with practice and reach out has provided exactly that. When you're fresh out of college you're kinda clueless with only few observations from internships to go off of. But this platform took us beyond the threshold of mere observations and offered real experience.",
    rating: 5,
    cohort: "Current Member",
    Img: sumbulImg
  },
  {
    name: "Ratnesh",
    role: "Counseling Psychologist",
    text: "As a psychologist who has just completed their degree, the process of establishing themselves has always been a challenge. I’m very thankful to this cohort for helping me in this journey. The experience of working with diverse clients, combined with the collaborative support of my peers, has been instrumental in shaping me as a more competent and community-minded practitioner. The conviction that quality care shouldn't be a privilege has also resonated with me deeply.",
    rating: 5,
    cohort: "Founding Member",
    Img: ratneshImg
  },
  {
    name: "Sakshi",
    role: "Special Educator ",
    text: "Reachout has been a turning point. The platform not only gave me access to real-time experiences but also helped me build the confidence I needed to handle clients and situations independently. The  team here encourage growth, making learning a continuous process. I can already see how much I’ve evolved from when I first joined, and I’m excited for the journey ahead.",
    rating: 5,
    cohort: "Founding Member",
    Img: sakshiImg
  },
  {
    name: "Sania",
    role: "Rehabilitation Psychologist",
    text: "Stepping into the professional world after college has been an exciting journey. I'm learning, growing, and gaining hands-on experience Reachout has given me an access to the clientele that only a fresher could dream of having",
    rating: 5,
    cohort: "Founding Member",
    Img: saniaImg
  },
  {
    name: "Krishna",
    role: "Counseling Psychologist",
    text: "Reachout has given me a space to actually learn beyond books. As a fresher, I always felt the need for real exposure, and here I got the chance to interact, observe, and grow as a psychologist. Each experience is adding to my confidence and helping me shape my professional journey.",
    rating: 5,
    cohort: "Current Member",
    Img: krishnaImg
  },
  {
    name: "Divya",
    role: "Counseling Psychologist",
    text: "Coming straight out of college, I had the knowledge but lacked real-world experience. ReachOut changed that for me. It offered a supportive space to work with real clients and truly step into the role of a psychologist. The guidance from peers and mentors helped me grow both personally and professionally. I now feel much more confident and prepared to make a meaningful impact",
    rating: 5,
    cohort: "Founding Member",
    Img: divyaImg
  }
];

export default function Reviews(){
    return(
        <section className="py-16 bg-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">What Our Founding Members Say</h2>
          <p className="text-muted-foreground">Join the community that's transforming mental healthcare</p>
          <div className="mt-8 text-center mb-12">



          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-soft hover:shadow-pink transition-all duration-300 hover:scale-105 bg-card h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-4">
                    <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-foreground italic">"{testimonial.text}"</p>
                  </div>
                </div>

                {/* Profile and Rating Row */}
                <div className="mt-6 flex items-center justify-between">
                  {/* Profile Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white flex-shrink-0">
                      <img
                        src={testimonial.Img}
                        alt={`${testimonial.name} - ${testimonial.role}`}
                        className="w-full h-full object-cover"
                        style={{
                          transform: 'scale(1.1)',
                          transformOrigin: 'center',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center center'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 bg-primary/10 p-2 rounded-lg">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Cohort Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              const pricingSection = document.getElementById('programs');
              if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded shadow-glow animate-pulse-glow hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="text-sm font-semibold">Join Founding Cohort</span>
          </button>
        </div>
      </div>
    </section>
    )
}