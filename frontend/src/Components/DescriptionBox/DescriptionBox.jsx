import React from 'react'
import './DescriptionBox.css'

export const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className='descriptionbox-navigator'>
            <div className='descriptionbox-nav-box'>Description</div>
            <div className='descriptionbox-nav-box fade'>reviews(122)</div>
        </div>
        <div className='descriptionbox-description'>
            <p>
            Embrace the future of online shopping with our secure payment options and swift delivery services, bringing your desired items right to your doorstep. Immerse yourself in a personalized shopping journey with tailored recommendations and exclusive deals. With a commitment to quality, our e-commerce website guarantees authenticity and satisfaction, making every purchase a delightful experience. Elevate your online shopping game with us – where innovation, style, and convenience converge for the ultimate customer satisfaction
            </p>
            <p>
                e-commerce website typically display products or services along with detailed description,images,prices and any available variations(e.g. sizes,colors). Each product usaually hjas its own dedicated page with relevant information
            </p>
        </div>
    </div>
  )
}
