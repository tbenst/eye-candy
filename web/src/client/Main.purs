module Main where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Data.Maybe (Maybe(..))
import Data.List (List(..), filter, head, (:))
import Graphics.Canvas (CANVAS, rect, fillPath, setFillStyle, getContext2D
                       ,Context2D, getCanvasElementById)
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

-- main :: Eff (canvas :: CANVAS, dom :: DOM) Unit
main = void $ unsafePartial do
    Just canvas <- getCanvasElementById "canvas"
    w <- window
    ctx <- getContext2D canvas
    let sample t = Rectangle { x: 200.0
                              , y: 250.0
                              , w: 100.0
                              , h: 100.0
                              , c: "red"
                              }

    let r = Behavior { at: sample }
                            
    log "starting"
    animationLoop w ctx r
    log "done"

    -- setFillStyle "#0000FF" ctx

    -- fillPath ctx $ rect ctx
    --     { x: 250.0
    --     , y: 250.0
    --     , w: 100.0
    --     , h: 100.0
    --     }