module Graphics.Canvas.Renderable where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Data.Maybe (Maybe(..))
import Data.List (List(..), filter, head, (:))
import Graphics.Canvas (CANVAS, rect, fillPath, setFillStyle, getContext2D
                       ,Context2D, getCanvasElementById)
import Partial.Unsafe (unsafePartial)
import Types

class Renderable a where
    render :: forall eff. Context2D -> a -> Eff (canvas :: CANVAS | eff) Unit

-- instance renderableMaybe :: Renderable Maybe where
--     render (Just a) = render a
--     render Nothing  = Nothing

    

newtype Bar = Bar {speed :: Number, width :: Number, barColor :: Color}

newtype Rectangle = Rectangle { x :: Number, y :: Number, w :: Number
                              , h :: Number, c :: Color
                              }



instance renderableRectangle :: Renderable Rectangle where
    render ctx (Rectangle {x,y,w,h,c}) = void do
        setFillStyle c ctx
        fillPath ctx $ rect ctx
            { x: x
            , y: y
            , w: w
            , h: h
            }

instance renderableList :: Renderable a => Renderable (List a) where
    render ctx renderables = go renderables where
        go Nil = do
            pure unit
        go (b : bs) = void do
            render ctx b
            go bs