import { useVideoPlayer, VideoView } from 'expo-video';
import { useEventListener } from 'expo';
import { useEffect, useRef, useState } from 'react';
import { PixelRatio, StyleSheet, View, Button, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const videoHeight = (screenWidth * 9) / 16; // Assuming 16:9 aspect ratio

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

export default function VideoScreen() {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
  });

  useEventListener(player, 'playToEnd', () => {
    console.log('*************************************');
    console.log('DEBUG: Event: playToEnd HAS FIRED!');
    console.log('DEBUG: Current player.loop state in playToEnd:', player.loop);
    console.log('*************************************');
    if (player.loop) {
      console.log('Loop triggered: Video finished and player.loop is true. Video will restart.');
    }
  });

  useEventListener(player, 'playbackRateChange', (event) => {
    console.log('Event: playbackRateChange, New Rate:', event.playbackRate, 'Old Rate:', event.oldPlaybackRate);
  });

  useEventListener(player, 'playingChange', (event) => {
    console.log('Event: playingChange, Is Playing:', event.isPlaying, 'Old Is Playing:', event.oldIsPlaying);
    setIsPlaying(event.isPlaying);
  });

  useEventListener(player, 'sourceChange', (event) => {
    console.log('Event: sourceChange, New Source:', event.newSource, 'Previous Source:', event.previousSource);
  });

  useEventListener(player, 'statusChange', (event) => {
    console.log('Event: statusChange, New Status:', event.newStatus, 'Old Status:', event.oldStatus);
    if (event.error) {
      console.error('!!! Player Error in statusChange:', event.error);
    }
  });

  useEventListener(player, 'volumeChange', (event) => {
    console.log('Event: volumeChange, New Volume:', event.volume, 'Old Volume:', event.oldVolume, "Is Muted:", event.isMuted);
  });

  useEffect(() => {
    console.log('Player instance initialized or changed. videoSource constant value:', videoSource);
    console.log('Initial player properties (after setup):');
    console.log('  currentTime:', player.currentTime);
    console.log('  duration:', player.duration);
    console.log('  isLive:', player.isLive);
    console.log('  loop:', player.loop);
    console.log('  muted:', player.muted);
    console.log('  playbackRate:', player.playbackRate);
    console.log('  playing:', player.playing);
    console.log('  source:', player.source);
    console.log('  status:', player.status);
    console.log('  volume:', player.volume);

    return () => {
      console.log('Player instance being released or component unmounting.');
    };
  }, [player]);

  return (
    <View style={styles.contentContainer}>
      <VideoView
        ref={ref}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      <View style={styles.controlsContainer}>
        <Button
          title="Toggle Loop"
          onPress={() => {
            const newLoopState = !player.loop;
            console.log('Action: Setting loop to', newLoopState);
            player.loop = newLoopState;
            console.log('  loop:', player.loop);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: screenWidth,
    height: videoHeight,
    backgroundColor: 'black',
  },
  controlsContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
