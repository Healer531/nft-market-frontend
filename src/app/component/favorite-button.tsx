import React, {FunctionComponent, useState} from 'react'

export interface FavoriteButtonProps {
  isFavoritePage: boolean;
}

const FavoriteButton: FunctionComponent<FavoriteButtonProps> = ({ isFavoritePage }) => {
  const [favorite, setFavorite] = useState<boolean>(true);

  return (
    <div>
      <button className="width-45 height-45 border-secondary border-radius-3 border-1" style={{ backgroundColor:"rgba(167,130,233,0.03)" }} type="button"
          onClick={() => setFavorite(!favorite)}>
       {
          isFavoritePage ? (
              <svg xmlns="http://www.w3.org/2000/svg" stroke='#fd6060' width="70%" height="70%" viewBox="0 0 512 512">
                <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                      style={{fill: 'none', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'32px'}} />
                <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                      style={{fill: 'none', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'32px'}} />
                <line x1="80" y1="112" x2="432" y2="112"
                      style={{fill: 'none', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'32px'}} />
                <path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
                      style={{fill: 'none', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'32px'}} />
                <line x1="256" y1="176" x2="256" y2="400"
                      style={{fill: 'none', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'32px'}} />
                <line x1="184" y1="176" x2="192" y2="400"
                      style={{fill: 'none', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'32px'}} />
                <line x1="328" y1="176" x2="320" y2="400"
                      style={{fill: 'none', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'32px'}} />
              </svg>
          ) : (
              <svg xmlns='http://www.w3.org/2000/svg' width='70%' height='70%' viewBox='0 0 512 512'>
                <path
                    d='M352.92,80C288,80,256,144,256,144s-32-64-96.92-64C106.32,80,64.54,124.14,64,176.81c-1.1,109.33,86.73,187.08,183,252.42a16,16,0,0,0,18,0c96.26-65.34,184.09-143.09,183-252.42C447.46,124.14,405.68,80,352.92,80Z'
                    style={{fill: favorite ? '#a782e9' : 'none', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'32px', stroke:'#a782e9'}} />
              </svg>
          )
        }
      </button>
    </div>
    )
  }

  export default FavoriteButton
