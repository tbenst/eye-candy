module Main where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Data.Maybe (Maybe(..))
import Data.List (List(..), filter, head, (:))
import Graphics.Canvas (CANVAS, rect, fillPath, setFillStyle, getContext2D
                       ,Context2D, getCanvasElementById)
import Partial.Unsafe (unsafePartial)

type Time = Number
type InitializeAnimation = Time -> Eff (canvas :: CANVAS | eff) Time
type AnimationLoop = Time -> Eff (canvas :: CANVAS | eff) Unit

foreign import requestAnimationFrame :: (Time -> *)
                                -> Eff (canvas :: CANVAS | eff) Unit

class Graphic a where
    render :: forall eff. Context2D -> a -> Eff (canvas :: CANVAS | eff) Unit

type Color = String

newtype Bar = Bar {speed :: Number, width :: Number, barColor :: Color}

newtype Rectangle = Rectangle { x :: Number, y :: Number, w :: Number
                              , h :: Number, c :: Color
                              }

type Behavior a = forall a. Graphic a => Number -> a

instance graphicRectangle :: Graphic Rectangle where
    render ctx (Rectangle {x,y,w,h,c}) = void do
        setFillStyle c ctx
        fillPath ctx $ rect ctx
            { x: x
            , y: y
            , w: w
            , h: h
            }

instance graphicList :: Graphic a => Graphic (List a) where
    render ctx graphics = go graphics where
        go Nil = do
            pure unit
        go (b : bs) = void do
            render ctx b
            go bs
    

-- main :: forall e. Eff (console :: CONSOLE | e) Unit
-- main = do
--   log "Hello sailor 2!"

newtype Letter = Letter Char 

animationLoop :: Time -> Time -> Eff (canvas :: CANVAS | eff) Time
animationLoop startTime now = void do where
    let time = now - startTime


initializeLoop :: InitializeAnimation
initializeLoop time = do
    pure time

main :: Eff (canvas :: CANVAS) Unit
main = void $ unsafePartial do
    Just canvas <- getCanvasElementById "canvas"
    ctx <- getContext2D canvas
    startTime <- requestAnimationFrame \x -> x


    let r = \t -> Rectangle { x: t*10.0,
                      , y: 250.0
                      , w: 100.0
                      , h: 100.0
                      , c: "red"
                      }

    render ctx (r:r1:Nil)

    -- setFillStyle "#0000FF" ctx

    -- fillPath ctx $ rect ctx
    --     { x: 250.0
    --     , y: 250.0
    --     , w: 100.0
    --     , h: 100.0
    --     }