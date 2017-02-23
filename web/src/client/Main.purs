module Main where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Data.Maybe (Maybe(..))
import Data.List (List(..), filter, head, (:))
import Graphics.Canvas (CANVAS, rect, fillPath, setFillStyle, getContext2D
                       ,Context2D, getCanvasElementById, getCanvasWidth
                       ,getCanvasHeight)
import Partial.Unsafe (unsafePartial)
import DOM (DOM())
import DOM.HTML (window)
import DOM.HTML.Types (Window())

import Types (Time, Behavior(..), Color, at)
import Graphics.Canvas.Animate (animationLoop)
import Graphics.Canvas.Renderable (Rectangle(..))



-- main :: forall e. Eff (console :: CONSOLE | e) Unit
-- main = do
--   log "Hello sailor 2!"

newtype Letter = Letter Char 

-- animationLoop :: forall e. Time -> Eff ( dom :: DOM
--                              , canvas :: CANVAS
--                              , console :: CONSOLE | e) Unit
-- animationLoop t = void do
--     log $ show t


-- main :: Eff (canvas :: CANVAS, dom :: DOM) Unit
main = void $ unsafePartial do
    Just canvas <- getCanvasElementById "canvas"
    w <- window
    ctx <- getContext2D canvas
    width <- getCanvasWidth canvas
    height <- getCanvasHeight canvas
    let sample t = Rectangle { x: 0.01*t
                              , y: 250.0
                              , w: 10.0
                              , h: 300.0
                              , c: "red"
                              }

    let b = Behavior { at: sample }
                            
    log "starting"
    animationLoop {w:w, ctx:ctx, width:width, height:height, b:b} 0.0
    log "done"

    -- setFillStyle "#0000FF" ctx

    -- fillPath ctx $ rect ctx
    --     { x: 250.0
    --     , y: 250.0
    --     , w: 100.0
    --     , h: 100.0
    --     }