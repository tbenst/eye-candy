module Types where

type Time = Number

type Color = String

newtype Behavior a = Behavior { at :: Number -> a}
at :: forall a. Behavior a -> Time -> a
at (Behavior {at: bat}) t = bat t
